import { Fragment } from "react";
import Head from "next/head";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/css/nextjs-argon-dashboard.css";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{Component.title} | ReCo Web Application</title>
      </Head>
      <Layout>
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => {
                return res.json().then((json) => json.data);
              }),
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    </Fragment>
  );
}

export default MyApp;
