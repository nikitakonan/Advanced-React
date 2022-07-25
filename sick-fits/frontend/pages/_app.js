/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from '@apollo/client';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import Page from '../components/Page';
import '../components/styles/nprogress.css';
import { CartStateProvider } from '../lib/cartState';
import withData from '../lib/withData';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <CartStateProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </CartStateProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  apollo: PropTypes.object,
};

export default withData(MyApp);
