import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Global } from '@emotion/react';
import { store } from '@store/index';
import { globalStyles } from '@styles/globals';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
  }, []);

  return (
    <Provider store={store}>
      <Global styles={globalStyles} />
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
