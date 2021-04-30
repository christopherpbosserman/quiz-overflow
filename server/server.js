const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const quizController = require('./controllers/quizController');
const quizControllerDB = require('./controllers/quizControllerDB');
const userController = require('./controllers/userController');
const sessionController = require('./controllers/sessionController');
const scoreController = require('./controllers/scoreController');
const questionController = require('./controllers/questionController');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../public')));

app.use('/build', express.static(path.resolve(__dirname, '../build')));

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

app.get('/check-session', sessionController.verifySession, (req, res) => {
  return res.status(200).json(res.locals.isLoggedIn);
});

app.post(
  '/signup',
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

app.post(
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

app.get(
  '/quiz-overflow',
  sessionController.verifySession,
  quizController.getQuestion,
  (req, res) => {
    // after frontend is ready to test, see if we can redirect to '/' in the case a session expires
    // after logging in or if we need to send a res.locals with empty key values for question and choices.

    if (!res.locals.isLoggedIn) {
      return res.status(200).json('Invalid session');
    }
    return res.status(200).json(res.locals);
  }
);

app.get(
  '/quiz-overflowDB',
  sessionController.verifySession,
  quizControllerDB.getQuestion,
  (req, res) => {
    // console.log('session isLoggedIn', res.locals.isLoggedIn);
    // if (!res.locals.isLoggedIn) {
    //   return res.status(200).json('Invalid session');
    // }
    return res.status(200).json(res.locals);
  }
);

app.get(
  '/high-score',
  sessionController.verifySession,
  scoreController.getHighScore,
  (req, res) => {
    if (!res.locals.isLoggedIn) {
      return res.status(200).json('Invalid session');
    }
    return res.status(200).json(res.locals);
  }
);

app.put(
  '/high-score',
  sessionController.verifySession,
  scoreController.getHighScore,
  scoreController.updateHighScore,
  (req, res) => {
    if (!res.locals.isLoggedIn) {
      return res.status(200).json('Invalid session');
    }
    return res.status(200).json(res.locals);
  }
);

app.post('/questions', questionController.addQuestion, (req, res) => {
  return res.status(200).send(res.locals.addedMsg);
});

app.get('/leaderboard', scoreController.getLeaderboard, (req, res) => {
  return res.status(200).json(res.locals.leaderboard);
});

app.use((req, res, next) => {
  return res.status(404).send('Not Found');
});

// global error checker
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
