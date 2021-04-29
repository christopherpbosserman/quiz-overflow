const bcrypt = require('bcryptjs');
const { NormalModuleReplacementPlugin } = require('webpack');

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

userController.verifyPassword = (req, res, next) => {
  console.log('userController.verifyPassword fired...');
  const { username, password } = req.body;
  const query =
    'SELECT password AS encryptedpassword FROM users WHERE username = ($1)';
  const values = [username];

  db.query(query, values).then((resp) => {
    if (resp.rows.length) {
      console.log(resp.rows[0]);
      const { encryptedpassword } = resp.rows[0];
      console.log(password, encryptedpassword);
      bcrypt.compare(password, encryptedpassword).then((resp) => {
        if (resp) {
          res.locals.loggedIn = true;
          return next();
        } else {
          res.locals.loggedIn = false;
          return next();
        }
      });
    } else {
      res.locals.loggedIn = false;
      return next();
    }
  });
};

userController.getUserInfo = (req, res, next) => {
  console.log('userController.getUserInfo fired...');

  if (res.locals.loggedIn) {
    const { username } = req.body;
    const query = 'SELECT _id FROM users WHERE username = ($1)';
    const values = [username];
    db.query(query, values)
      .then((resp) => {
        if (resp.rows.length) {
          res.locals.userID = resp.rows[0]._id;
          return next();
        } else return next();
      })
      .catch((err) => {
        return next({
          log: `Error in userController.getUserInfo middleware: ${err}`,
          message: { err: 'An error occurred' },
        });
      });
  } else return next();
};

module.exports = userController;
