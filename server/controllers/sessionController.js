let jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../models/quizModels');

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const sessionController = {};

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

sessionController.startSession = (req, res, next) => {
  console.log('sessionController.startSession fired...');
  if (res.locals.loggedIn) {
    const sessionTime = '10 minutes';
    const query = ` INSERT INTO 
                    sessions (session_id, user_id, expires_by)
                    VALUES
                    ('${res.locals.sessionID}', ${res.locals.userID}, NOW() + interval '${sessionTime}')`;
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

sessionController.verifySession = (req, res, next) => {
  console.log('sessionController.verifySession fired...');
  const { SSID } = req.cookies;
  const query =
    'SELECT * FROM sessions WHERE session_id = ($1) AND expires_by > NOW()';
  const values = [SSID];

  db.query(query, values)
    .then((resp) => {
      if (resp.rows.length) {
        res.locals.isLoggedIn = true;
        res.locals.userID = resp.rows[0].user_id;
        return next();
      } else {
        res.locals.isLoggedIn = false;
        return next();
      }
    })
    .catch((err) => {
      return next({
        log: `Error in sessionController.verifySession middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

sessionController.verifySessionJWT = (req, res, next) => {
  console.log('sessionController.verifySessionJWT fired...');
  const { SSID } = req.cookies;

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
