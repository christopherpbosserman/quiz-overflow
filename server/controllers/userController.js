const bcrypt = require('bcryptjs');

const db = require('../models/quizModels');

const SALT_WORK_FACTOR = 6;

const userController = {};

userController.checkIfUsernameExists = (req, res, next) => {
  console.log('userController.checkIfUsernameExists fired...');
  const { username } = req.body;
  const query = 'SELECT username FROM users WHERE username = ($1)';
  const values = [username];

  db.query(query, values)
    .then((resp) => {
      if (resp.rows.length) {
        res.locals.usernameTaken = true;
        return next();
      } else return next();
    })
    .catch((err) => {
      return next({
        log: `Error in userController.checkIfUsernameExists middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

userController.encryptPassword = (req, res, next) => {
  console.log('userController.encryptPassword fired...');
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

  if (!res.locals.usernameTaken) {
    db.query(query, values)
      .then((resp) => {
        res.locals.userID = resp.rows[0]._id;
        res.locals.isLoggedIn = true;
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
      const { encryptedpassword } = resp.rows[0];

      bcrypt.compare(password, encryptedpassword).then((resp) => {
        if (resp) {
          res.locals.isLoggedIn = true;
          return next();
        } else {
          res.locals.isLoggedIn = false;
          return next();
        }
      });
    } else {
      res.locals.isLoggedIn = false;
      return next();
    }
  });
};

userController.getUserID = (req, res, next) => {
  console.log('userController.getUserID fired...');

  if (res.locals.isLoggedIn) {
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
          log: `Error in userController.getUserID middleware: ${err}`,
          message: { err: 'An error occurred' },
        });
      });
  } else return next();
};

module.exports = userController;
