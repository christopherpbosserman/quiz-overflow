import * as types from '../actions/actionTypes';

const initialState = {
  card: {
    question: 'Loading...',
    choices: [
      { choice: '...', isCorrect: true },
      { choice: '...', isCorrect: false },
      { choice: '...', isCorrect: false },
      { choice: '...', isCorrect: false },
    ],
  },
  deck: [],
  highScore: 0,
  currentScore: 0,
  cardsThisSession: 1,
  correctAnswers: 0,
};

const quizReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CORRECT_CHOICE: {
      console.log('quizReducer:CORRECT_CHOICE');
      let correctAnswers = (state.correctAnswers += 1);
      let currentScore = (state.currentScore += 1);
      return {
        ...state,
        correctAnswers,
        currentScore,
      };
    }

    case types.NEW_HIGHSCORE: {
      let highScore = action.payload;
      return {
        ...state,
        highScore,
      };
    }

    case types.GET_NEW_CARD: {
      console.log('quizReducer:GET_NEW_CARD');
      let deck = state.deck.slice();
      let card = deck.pop();

      return {
        ...state,
        card,
        deck,
      };
    }

    case types.NEW_DECK_RECEIVED: {
      console.log('quizReducer:NEW_DECK_RECEIVED');
      let deck = action.payload;
      let card = deck.pop();

      return {
        ...state,
        deck,
        card,
      };
    }

    case types.HIGHSCORE_RECEIVED: {
      console.log('quizReducer:HIGHSCORE_RECEIVED');
      let highScore = action.payload;
      return {
        ...state,
        highScore,
      };
    }

    case types.HIGHSCORE_UPDATED: {
      return { ...state };
    }

    case types.HIGHSCORE_REQUEST: {
      return { ...state };
    }

    default: {
      return { ...state };
    }
  }
};

export default quizReducer;
