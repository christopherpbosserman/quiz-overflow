const db = require('../models/quizModels');
const { all } = require('../routers/gameRouter');

const quizController = {};

quizController.getQuestions = (req, res, next) => {
  console.log('quizController.getQuestions fired...');

  const query =
    'SELECT q._id AS qid, q.text AS question FROM quiz_question q ORDER BY q._id';
  db.query(query)
    .then((result) => {
      res.locals.questions = result.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: `Error in quizController.getQuestions middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

quizController.getChoices = (req, res, next) => {
  console.log('quizController.getChoices fired...');

  const query =
    'SELECT c.text as choice, c.is_correct, c.quiz_question_id as qqid FROM quiz_question_choices c ORDER BY c.quiz_question_id';
  db.query(query)
    .then((result) => {
      res.locals.choices = result.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: `Error in quizController.getChoices middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

quizController.formatQuiz = (req, res, next) => {
  console.log('quizController.formatQuiz fired...');

  // make a copy of the questions array to add choices to
  const quiz = res.locals.questions.slice();
  let choicesArray = [];
  let questionCount = 0;

  res.locals.choices.forEach((choice, i) => {
    choicesArray.push(choice);

    // after every 4 choices, add to respective question element in quiz
    if ((i + 1) % 4 === 0) {
      quiz[questionCount].choices = choicesArray;
      choicesArray = [];
      questionCount += 1;
    }
  });
  res.locals.quiz = quiz;
  delete res.locals.questions;
  delete res.locals.choices;

  return next();
};

quizController.shuffleQuiz = (req, res, next) => {
  console.log('quizController.shuffleQuiz fired...');

  // shuffle questions
  knuthShuffle(res.locals.quiz);

  // shuffle choices
  res.locals.quiz.forEach((question) => {
    knuthShuffle(question.choices);
  });
  return next();
};

knuthShuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

///////////

quizController.getQuestionsAndChoices = (req, res, next) => {
  console.log('quizController.getQuestionsAndChoices fired...');

  const query = `SELECT q._id AS questionid, q.text AS question, c.text AS choice, c.is_correct
                FROM quiz_question q  
                JOIN quiz_question_choices c
                ON q._id = c.quiz_question_id
                ORDER BY q._id`;

  db.query(query)
    .then((result) => {
      res.locals.questionsAndChoices = result.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: `Error in quizController.getQuestionsAndChoices middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

quizController.formatALL = (req, res, next) => {
  console.log('quizController.formatALL fired...');

  const quiz = [];
  let choicesArray = [];
  let questionCount = 0;

  res.locals.questionsAndChoices.forEach((row, i) => {
    let choiceObject = {
      choice: row.choice,
      isCorrect: row.is_correct,
    };
    choicesArray.push(choiceObject);

    // after every 4 choices, build out question object and add to quiz array
    if ((i + 1) % 4 === 0) {
      let questionObject = {
        questionID: row.questionid,
        question: row.question,
        choicesArray,
      };
      quiz.push(questionObject);
      choicesArray = [];
      questionCount += 1;
    }
  });

  res.locals.quiz = quiz;
  delete res.locals.questionsAndChoices;

  return next();
};

module.exports = quizController;
