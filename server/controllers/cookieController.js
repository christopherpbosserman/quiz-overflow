const cookieController = {};

cookieController.setSSIDCookie = (req, res, next) => {
  console.log('cookieController.setSSIDCookie fired...');
  if (res.locals.loggedIn) {
    res.cookie('SSID', res.locals.userID, { httpOnly: true });
    return next();
  } else {
    return next();
  }
};

module.exports = cookieController;
