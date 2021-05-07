const db = require('../models/quizModels');

const quizController = {};

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

quizController.formatDeck = (req, res, next) => {
  console.log('quizController.formatDeck fired...');

  const deck = [];
  let choices = [];

  res.locals.questionsAndChoices.forEach((row, i) => {
    let choiceObject = {
      choice: row.choice,
      isCorrect: row.is_correct,
    };
    choices.push(choiceObject);

    // after every 4 choices, build out question object and add to deck array, reset choices array
    if ((i + 1) % 4 === 0) {
      let questionObject = {
        questionID: row.questionid,
        question: row.question,
        choices,
      };
      deck.push(questionObject);
      choices = [];
    }
  });

  res.locals.deck = deck;
  delete res.locals.questionsAndChoices;

  return next();
};

quizController.shuffleDeck = (req, res, next) => {
  console.log('quizController.shuffleDeck fired...');
  // shuffle questions
  knuthShuffle(res.locals.deck);

  // shuffle choices
  res.locals.deck.forEach((question) => {
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

module.exports = quizController;
