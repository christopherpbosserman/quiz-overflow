const bcrypt = require('bcryptjs');

const db = require('../models/quizModels');

const SALT_WORK_FACTOR = 6;

const userController = {};

userController.checkUsernameExists = (req, res, next) => {
  console.log('userController.checkUsernameExists fired...');
  const { username } = req.body;
  const query = 'SELECT username FROM users WHERE username = ($1)';
  const values = [username];
  db.query(query, values)
    .then((resp) => {
      if (resp.rows.length) {
        res.locals.usernameExists = true;
        return next();
      } else return next();
    })
    .catch((err) => {
      return next({
        log: `Error in userController.checkUsernameExists middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

userController.encryptPassword = (req, res, next) => {
  const { password } = req.body;
  bcrypt
    .hash(password, SALT_WORK_FACTOR)
    .then((resp) => {
      res.locals.encryptedPassword = resp;
      return next();
    })
    .catch((err) => {
      return next({
        log: `Error in userController.encryptPassword middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

userController.createUser = (req, res, next) => {
  console.log('userController.createUser fired...');
  const { username } = req.body;
  const { encryptedPassword } = res.locals;
  const query =
    'INSERT INTO users (username, password, high_score) VALUES ($1, $2, $3) RETURNING _id';
  const values = [username, encryptedPassword, 0];

  if (!res.locals.usernameExists) {
    db.query(query, values)
      .then((resp) => {
        res.locals.userID = resp.rows[0]._id;
        res.locals.loggedIn = true;
        return next();
      })
      .catch((err) => {
        return next({
          log: `Error in userController.createUser middleware: ${err}`,
          message: { err: 'An error occurred' },
        });
      });
  } else {
    return next();
  }
};

userController.verifyUser = (req, res, next) => {
  console.log('userController.verifyUser fired...');
  const { username } = req.body;
  const { encryptedPassword } = res.locals;
  const query =
    'SELECT _id, username FROM users WHERE username = ($1) AND password = ($2)';
  const values = [username, encryptedPassword];
  db.query(query, values)
    .then((resp) => {
      if (resp.rows.length) {
        res.locals.userID = resp.rows[0]._id;
        res.locals.loggedIn = true;
        return next();
      } else return next();
    })
    .catch((err) => {
      return next({
        log: `Error in userController.verifyUser middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

module.exports = userController;
