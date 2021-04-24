import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/authActions';

import Login from '../components/Login';

const mapStateToProps = (state) => ({
  showSignup: state.auth.showSignup,
  message: state.auth.message,
  loginFailure: state.auth.loginFailure,
});

const mapDispatchToProps = (dispatch) => ({
  handleLogin: () => {
    console.log('handleLogin fired...');
    dispatch(
      actions.postLogin({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      })
    );
  },

  handleSignUp: () => {
    console.log('handleSignup fired...');
    dispatch(
      actions.postSignup({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      })
    );
  },
});

class AuthContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="authContainer">
        <Login {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
