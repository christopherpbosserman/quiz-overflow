import * as types from './actionTypes';

export const getNewDeck = () => (dispatch) => {
  console.log('actions:getNewDeck fired...');
  fetch('/game/deck')
    .then((res) => res.json())
    .then((data) => {
      const { deck } = data;
      return dispatch({
        type: types.NEW_DECK_RECEIVED,
        payload: deck,
      });
    });
};

export const getNewCard = (deckSize) => (dispatch) => {
  console.log('actions:getNewCard fired...');
  if (deckSize.length === 0) dispatch(getNewDeck());
  else
    return dispatch({
      type: types.GET_NEW_CARD,
    });
};

export const getHighScore = () => (dispatch) => {
  dispatch({ type: types.HIGHSCORE_REQUEST });
  fetch('/game/high-score')
    .then((res) => res.json())
    .then((res) =>
      dispatch({
        type: types.HIGHSCORE_RECEIVED,
        payload: res.highScore,
      })
    );
};

export const updateHighScore = (score) => (dispatch) => {
  console.log('actions:updateHighScore fired...');
  fetch('/game/high-score', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score: score }),
  })
    .then((res) => res.json())
    .then((res) => {
      dispatch({
        type: types.HIGHSCORE_RECEIVED,
        payload: res.highScore,
      });
    });
};

export const newHighScore = (score) => ({
  type: types.NEW_HIGHSCORE,
  payload: score,
});

export const correctChoice = (currScore, highScore) => (dispatch) => {
  console.log('actions:correctChoice fired...');
  if (currScore >= highScore) dispatch(updateHighScore(currScore + 1));
  dispatch({ type: types.CORRECT_CHOICE });
};
