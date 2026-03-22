import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Seanard | Book Library</title>

        {/* Primary Meta */}
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="A GraphQL-powered book library to browse, add, and manage your book collection."
        />
        <meta
          name="keywords"
          content="books, library, graphql, book collection, reading"
        />
        <meta name="author" content="Book Library" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Book Library" />
        <meta
          property="og:description"
          content="A GraphQL-powered book library to browse, add, and manage your book collection."
        />
        <meta property="og:site_name" content="Book Library" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Book Library" />
        <meta
          name="twitter:description"
          content="A GraphQL-powered book library to browse, add, and manage your book collection."
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
