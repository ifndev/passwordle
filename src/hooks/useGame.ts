import { useReducer } from "react";
import passwords from "../helpers/passwords";
import {
  getRandomWord,
  getAlphabet,
  Status,
  calculateBudget,
  Game,
  checkGuess,
  LetterValidity,
} from "../helpers/gameUtils";

function gameReducer(
  game: Game,
  action: { type: string; payload?: any }
): Game {
  switch (action.type) {
    case "guess": {
      // Throw if the game is not runnnig
      if (game.status !== Status.PLAYING) {
        throw new Error("Game is not in progress");
      }

      const guessedWord = action.payload.guess;
      const validity = checkGuess(guessedWord, game.targetWord);

      // All letters are valid: player wins
      if (validity.every((v) => v === LetterValidity.VALID)) {
        return {
          ...game,
          status: Status.WON,
          guesses: [...game.guesses, { guessedWord: guessedWord, validity }],
        };

        // No tries left: player loses
      } else if (game.guesses.length + 1 >= game.maxTries) {
        return {
          ...game,
          status: Status.LOST,
          guesses: [...game.guesses, { guessedWord: guessedWord, validity }],
        };
      }

      // Otherwise, add the guess to the list of guesses
      else {
        return {
          ...game,
          guesses: [...game.guesses, { guessedWord: guessedWord, validity }],
        };
      }
    }
    case "restart": {
      return initializeGame(action.payload);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

function initializeGame(initialArg: { target?: string; tries?: number }) {
  // Game state initialization
  const game: Game = {
    targetWord: initialArg.target || getRandomWord(passwords), // By default, pick a random word
    maxTries: initialArg.tries || 8, // By default, 8 tries
    guesses: [],
    status: Status.PLAYING,
    alphabet: getAlphabet(passwords),
    budget: {},
  };

  // Calculate the budget
  game.budget = calculateBudget(game.targetWord);

  return game;
}

function useGame(initialValue: {
  target?: string;
  tries?: number;
}): [Game, React.Dispatch<{ type: string; payload?: any }>] {
  initialValue = initialValue || {};
  const [game, dispatch] = useReducer(
    gameReducer,
    initialValue,
    initializeGame
  );

  return [game, dispatch];
}

export default useGame;
