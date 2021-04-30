import React from 'react';
import { connect } from 'react-redux';
import AuthContainer from './AuthContainer';
import CardContainer from './CardContainer';

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const MainContainer = (props) => {
  const auth = props.isLoggedIn ? <CardContainer /> : <AuthContainer />;

  return auth;
};

export default connect(mapStateToProps)(MainContainer);
