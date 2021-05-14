const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const sessionController = {};

sessionController.startSession = (req, res, next) => {
  // console.log('sessionController.startSession fired...');

  if (res.locals.isLoggedIn) {
    const { userID } = res.locals;

    // create a JWT holding userID, expiring in 1 hour and save to cookies
    jwt.sign({ userID }, JWT_PRIVATE_KEY, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        return next({
          log: `Error in sessionController.startSession middleware: ${err}`,
          message: { err: 'An error occurred' },
        });
      } else {
        res.cookie('SSID', token, { httpOnly: true });
        return next();
      }
    });
  } else {
    return next();
  }
};

sessionController.verifySessionAndGetUserID = (req, res, next) => {
  // console.log('sessionController.verifySessionAndGetUserID fired...');
  const { SSID } = req.cookies;

  // verify JWT read from cookies, grab userID and allow access
  jwt.verify(SSID, JWT_PRIVATE_KEY, (err, payload) => {
    if (err) {
      res.locals.isLoggedIn = false;
      return next();
    } else {
      res.locals.userID = payload.userID;
      res.locals.isLoggedIn = true;
      return next();
    }
  });
};

module.exports = sessionController;
