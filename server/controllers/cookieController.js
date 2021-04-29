let randomString = require('randomstring');

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

module.exports = cookieController;
