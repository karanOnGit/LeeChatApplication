import React, { useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';

const containerStyles = css`
  padding: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.gray[100]};
  background-color: ${theme.colors.white};
`;

const inputGroupStyles = css`
  display: flex;
  align-items: flex-end;
  gap: ${theme.spacing[2]};
`;

const inputWrapperStyles = css`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.white};
  transition: ${theme.transitions.fast};

  &:focus-within {
    border-color: ${theme.colors.gray[400]};
  }
`;

const inputStyles = css`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: ${theme.fontSize.sm};
  font-family: inherit;
  resize: none;
  max-height: 100px;

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
`;

const actionButtonStyles = css`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const sendButtonStyles = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.primary[600]};
  color: ${theme.colors.white};
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.primary[700]};
  }

  &:disabled {
    background-color: ${theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
}) => {
  const [rows, setRows] = useState(1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    const newRows = Math.min(Math.max(1, e.target.scrollHeight / 20), 5);
    setRows(newRows);
  };

  return (
    <div className={containerStyles}>
      <div className={inputGroupStyles}>
        <div className={inputWrapperStyles}>
          <button className={actionButtonStyles} title="Emoji">
            😊
          </button>
          <textarea
            className={inputStyles}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={rows}
            disabled={disabled}
          />
          <button className={actionButtonStyles} title="Attach">
            📎
          </button>
        </div>
        <button
          className={sendButtonStyles}
          onClick={onSend}
          disabled={!value.trim() || disabled}
          title="Send"
        >
          ➤
        </button>
      </div>
    </div>
  );
};
