import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AuthContainer from './containers/AuthContainer';
import CardContainer from './containers/CardContainer';
import * as authActions from './actions/authActions';

export default () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    fetch('/auth/verify-session')
      .then((res) => res.json())
      .then((sessionStatus) => {
        dispatch(authActions.changeLoginStatus(sessionStatus));
      })
      .catch((err) => console.log(err));
  }, []);

  const auth = isLoggedIn ? <CardContainer /> : <AuthContainer />;
  return <div className="mainContainer">{auth}</div>;
};
