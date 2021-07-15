import { Fragment } from "react";
import Head from "next/head";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/css/nextjs-argon-dashboard.css";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import AuthService from "../services/authService";

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const router = useRouter();

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
                if(res.status == 401) {
                  AuthService.logout();
                  router.push('login');
                  return null;
                }
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
