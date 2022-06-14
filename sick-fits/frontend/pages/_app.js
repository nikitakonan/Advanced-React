/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import Page from '../components/Page';

export default function MyApp({ Component, pageProps }) {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
