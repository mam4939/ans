import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ru">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/icons/icon-192.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{ __html: `(function(){ if ('serviceWorker' in navigator) { window.addEventListener('load', function(){ navigator.serviceWorker.register('/service-worker.js').catch(()=>{}); }); } })()` }} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
