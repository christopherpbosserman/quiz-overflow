const db = require('../models/quizModels');

const quizController = {};

quizController.getQuestions = (req, res, next) => {
  console.log('quizController.getQuestions fired...');

  const query = 'SELECT * FROM quiz_question ORDER BY RANDOM() LIMIT 5';
  const resultArray = [];

  // SELECT * FROM quiz_question q JOIN quiz_question_choices c ON q._id = c.quiz_question_id ORDER BY RANDOM() LIMIT 5;
  // ORDER BY RANDOM() LIMIT 5

  db.query(query)
    .then((result) => {
      for (let i = 0; i < 5; i++) {
        const questionObject = {};

        const questionID = result.rows[i]._id;
        const question = result.rows[i].text;

        questionObject.question = question;
        questionObject.questionID = questionID;

        const queryChoices = `SELECT c._id, c.text, c.is_correct FROM quiz_question_choices c WHERE c.quiz_question_id = ${questionID}`;

        db.query(queryChoices).then((qResult) => {
          const choices = qResult.rows;
          const randomNum = Math.floor(Math.random() * 4);
          for (let i = 0; i < randomNum; i++) {
            choices.unshift(choices.pop());
          }

          //choices key holds array of answer choices
          resultArray.push({ ...questionObject, choices });
          if (resultArray.length === 5) {
            res.locals.questions = resultArray;
            console.log(resultArray);
            return next();
          }
        });
      }
    })
    .catch((err) => next(err));
};

quizController.getQuiz = (req, res, next) => {
  console.log('quizController.getQuiz fired...');

  const unformattedQuestions = quizController.getQuestions();
  const formattedQuestions = quizController.formatQuestions(
    unformattedQuestions
  );
};

quizController.getQuestions2 = (req, res, next) => {
  console.log('quizController.getQuestions fired...');

  const query =
    'SELECT q._id AS qid, q.text as question, c.text as choice, c.is_correct FROM quiz_question q JOIN quiz_question_choices c ON q._id = c.quiz_question_id';
  db.query(query)
    .then((result) => {
      console.log(result.rows);
      quizController.formatQuestions(result.rows);
    })
    .catch((err) => {
      return next({
        log: `Error in quizController.getQuestions middleware: ${err}`,
        message: { err: 'An error occurred' },
      });
    });
};

quizController.formatQuestions = (unformattedQuiz) => {
  console.log('quizController.formatQuestions fired...');

  const formattedQuiz = [];
  let questionAndChoices = { choices: [] };
  // array of objects, id, text, id, quiz_quesdtion id, text, is correct
  for (let i = 0; i < unformattedQuiz.length; i += 1) {
    if (i !== 0 && i % 4 === 0) {
      formattedQuiz.push(questionAndChoices);
      questionAndChoices = { choices: [] };
    }
    questionAndChoices.question_id = unformattedQuiz[i].qid;
    questionAndChoices.question = unformattedQuiz[i].question;
    const choicesObject = {};
    choicesObject.choice = unformattedQuiz[i].choice;
    choicesObject.isCorrect = unformattedQuiz[i].isCorrect;
    questionAndChoices.choices.push(choicesObject);
  }
  formattedQuiz.push(questionAndChoices);
  console.log(formattedQuiz);
};

module.exports = quizController;
