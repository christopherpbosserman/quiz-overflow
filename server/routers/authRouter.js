const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');

router.get(
  '/verify-session',
  sessionController.verifySessionAndGetUserID,
  (req, res) => {
    return res.status(200).json(res.locals.isLoggedIn);
  }
);

router.post(
  '/sign-up',
  userController.checkIfUsernameExists,
  userController.encryptPassword,
  userController.createUser,
  sessionController.startSession,
  (req, res) => {
    if (res.locals.usernameTaken) {
      return res
        .status(200)
        .json({ message: 'Username already taken.', isLoggedIn: false });
    }
    return res
      .status(200)
      .json({ message: 'New user added.', isLoggedIn: true });
  }
);

router.post(
  '/login',
  userController.encryptPassword,
  userController.verifyPassword,
  userController.getUserID,
  sessionController.startSession,
  (req, res) => {
    if (!res.locals.isLoggedIn) {
      return res
        .status(200)
        .json({ message: 'Incorrect username/password.', isLoggedIn: false });
    }
    return res
      .status(200)
      .json({ message: 'Log in successful.', isLoggedIn: true });
  }
);

module.exports = router;
