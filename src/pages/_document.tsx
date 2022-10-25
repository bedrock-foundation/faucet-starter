/* eslint-disable react/no-danger */
import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { CssBaseline } from '@geist-ui/core';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = CssBaseline.flush();

    return {
      ...initialProps,
      styles: [
        <React.Fragment key="1">
          {initialProps.styles}
          {styles}
        </React.Fragment>,
      ],
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <>
            {/* <!-- Load Fonts --> */}
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
            {/* <!-- Load Google Analytics --> */}
            {/* Load in GA */}
            {/* <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            /> */}
            {/* <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
            `,
              }}
            /> */}
            <style>
              {`* {
                word-break: break-word !important;
              }`}
            </style>
          </>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
