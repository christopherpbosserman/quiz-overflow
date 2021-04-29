let randomString = require('randomstring');
let jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const cookieController = {};

cookieController.setSSIDCookie = (req, res, next) => {
  console.log('cookieController.setSSIDCookie fired...');
  if (res.locals.loggedIn) {
    res.locals.sessionID = randomString.generate(16);
    res.cookie('SSID', res.locals.sessionID, { httpOnly: true });
    return next();
  } else {
    return next();
  }
};

cookieController.setSSIDJWT = (req, res, next) => {
  console.log('cookieController.setSSIDJWT fired...');

  if (res.locals.loggedIn) {
    const { userID } = res.locals;

    jwt.sign({ userID }, JWT_PRIVATE_KEY, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        return next({
          log: `Error in cookieController.setSSIDJWT middleware: ${err}`,
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

module.exports = cookieController;
