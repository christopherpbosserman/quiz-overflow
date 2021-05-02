const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');

const sessionController = require('./controllers/auth/sessionController');

const quizController = require('./controllers/quizController');
const scoreController = require('./controllers/scoreController');
const questionController = require('./controllers/questionController');

const app = express();
const PORT = 3000;

// global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static paths
app.use(express.static(path.resolve(__dirname, '../public')));
app.use('/build', express.static(path.resolve(__dirname, '../build')));

// routers
const authRouter = require('./routers/authRouter');
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

app.get('/quiz-overflow', quizController.getQuestions, (req, res) => {
  return res.status(200).json(res.locals);
});

app.get('/testing', quizController.getQuestions2, (req, res) => {
  console.log('done');
  return res.status(200).json(res.locals);
});

app.get(
  '/high-score',
  sessionController.verifySession,
  scoreController.getHighScore,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
);

app.put(
  '/high-score',
  scoreController.getHighScore,
  scoreController.updateHighScore,
  (req, res) => {
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
  return res.status(404).send('Page Not Found');
});

// global error handler
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
