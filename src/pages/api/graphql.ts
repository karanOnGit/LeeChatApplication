import type { NextApiRequest, NextApiResponse } from 'next';
import { buildSchema, graphql } from 'graphql';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from '@graphql/resolvers';

// Read the schema from file
const schemaPath = join(process.cwd(), 'src/graphql/schema.graphql');
const schemaString = readFileSync(schemaPath, 'utf-8');
const schema = buildSchema(schemaString);

type ResponseData = {
  data?: any;
  errors?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }

  const { query, variables } = req.body;

  if (!query) {
    return res.status(400).json({ errors: [{ message: 'Query is required' }] });
  }

  try {
    const result = await graphql({
      schema,
      source: query,
      rootValue: resolvers,
      variableValues: variables,
    });

    if (result.errors) {
      return res.status(400).json({ errors: result.errors });
    }

    return res.status(200).json({ data: result.data });
  } catch (error) {
    console.error('GraphQL Error:', error);
    return res.status(500).json({
      errors: [
        {
          message: error instanceof Error ? error.message : 'Internal server error',
        },
      ],
    });
  }
}
