const db = require('../models/quizModels');

const scoreController = {};

scoreController.getHighScore = (req, res, next) => {
  console.log('scoreController.getHighScore fired...');
  if (res.locals.isLoggedIn) {
    const getScoreQuery = `SELECT high_score FROM users WHERE users._id = ${res.locals.userID}`;
    db.query(getScoreQuery, (err, queryRes) => {
      if (err) {
        console.log('error in getHighScore: ', err);
        return next(err);
      } else if (!queryRes.rows[0]) {
        res.locals.highScore = 0;
      } else {
        // console.log('high score: ', queryRes.rows[0].high_score);
        res.locals.highScore = queryRes.rows[0].high_score;
      }
      return next();
    });
  } else {
    return next();
  }
};

scoreController.updateHighScore = (req, res, next) => {
  if (res.locals.isLoggedIn) {
    console.log(req.body);
    console.log(typeof req.body.score);
    if (req.body.score > res.locals.highScore) {
      const updateScoreQuery = `UPDATE users SET high_score = ${req.body.score} WHERE users._id = ${res.locals.userID}`;
      db.query(updateScoreQuery, (err, queryRes) => {
        if (err) {
          console.log('error in updateHighScore: ', err);
          return next(err);
        } else {
          console.log('updated score');
          res.locals.highScore = req.body.score;
          return next();
        }
      });
    } else {
      return next();
    }
  } else {
    return next();
  }
};

scoreController.getLeaderboard = (req, res, next) => {
  const leaderboardQuery =
    'SELECT username, high_score FROM high_score h JOIN users u ON u._id = h.users_id ORDER BY high_score DESC LIMIT 10';

  db.query(leaderboardQuery)
    .then((data) => {
      console.log(data.rows);
      res.locals.leaderboard = data.rows;
      return next();
    })
    .catch((err) => {
      if (err) {
        console.log('error in getLeaderboard: ', err);
        return next(err);
      }
    });
};

module.exports = scoreController;
