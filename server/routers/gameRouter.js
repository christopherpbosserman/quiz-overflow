const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quizController');
const sessionController = require('../controllers/sessionController');
const userController = require('../controllers/userController');

router.get(
  '/deck',
  quizController.getQuestionsAndChoices,
  quizController.formatDeck,
  quizController.shuffleDeck,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
);

router.get(
  '/high-score',
  sessionController.verifySessionAndGetUserID,
  userController.getHighScore,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
);

router.put(
  '/high-score',
  sessionController.verifySessionAndGetUserID,
  userController.getHighScore,
  userController.updateHighScore,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
);

module.exports = router;
