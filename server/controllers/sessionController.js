const db = require('../models/quizModels');

const sessionController = {};

sessionController.startSession = (req, res, next) => {
  console.log('sessionController.startSession fired...');
  if (res.locals.loggedIn) {
    console.log(res.locals.userID);
    const sessionTime = '10 minutes';
    const query = `INSERT INTO sessions (cookie_id, expires_by) VALUES (${res.locals.userID}, NOW() + interval '${sessionTime}')`;
    db.query(query)
      .then((resp) => {
        return next();
      })
      .catch((err) => {
        return next({
          log: `Error in sessionController.startSession middleware: ${err}`,
          message: { err: 'An error occurred' },
        });
      });
  } else return next();
};

sessionController.isLoggedIn = (req, res, next) => {
  console.log('sessionController.isLoggedIn fired...');
  if (!isNaN(req.cookies.SSID)) {
    // if user has a SSID cookie that is a number then will check for active session
    const query = `SELECT * FROM sessions WHERE cookie_id = ${req.cookies.SSID} AND expires_by > NOW()`;
    db.query(query, (err, queryRes) => {
      if (err) {
        console.log('err in isLoggedIn ', err);
        return next(err);
      } else {
        if (queryRes.rows.length) {
          res.locals.cookieSessionMatch = true;
          return next();
        } else {
          res.locals.cookieSessionMatch = false;
          return next();
        }
      }
    });
  } else {
    res.locals.cookieSessionMatch = false;
    return next();
  }
};

module.exports = sessionController;
