import { useState } from "react";
import Word from "./components/Word";
import Guesses from "./components/Guesses";
import Keyboard from "./components/Keyboard";
import useKeypress from "./hooks/useKeypress";
import "./App.css";
import useGame from "./hooks/useGame";
import { Guess, LetterValidity, Status } from "./helpers/gameUtils";
import { ANIMTIME } from "./constants/settings";

function App({ target, maxGuesses }: { target?: string; maxGuesses?: number }) {
  const [input, setInput] = useState<string>("");
  const [game, dispatch] = useGame({
    target: target,
    tries: maxGuesses,
  });
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  /**
   * Check if the key is valid
   * @param key key to check
   * @returns boolean
   */
  const keyValid = (key: string) => {
    return game.alphabet.includes(key);
  };

  const handleKeyPressed = (key: string) => {
    // Ignore if game ended
    if (game.status !== Status.PLAYING) return;

    if (key === "Backspace") {
      popLetter();
    } else if (key === "Enter") {
      submitGuess();
    } else if (keyValid(key)) {
      pushLetter(key);
    }
  };

  const pushLetter = (letter: string) => {
    if (input.length === game.targetWord.length) return;
    setInput(input + letter);
  };

  const popLetter = () => {
    if (input.length === 0) return;
    setInput(input.slice(0, -1));
  };

  const guessValid = () => {
    return input.length === game.targetWord.length;
  };

  const submitGuess = () => {
    if (guessValid()) {
      dispatch({ type: "guess", payload: { guess: input } });
      setInput("");
      reveal();
    }
  };

  const reveal = () => {
    setIsRevealing(true);

    // Wait until the animation is done
    setTimeout(() => {
      setIsRevealing(false);
    }, ANIMTIME * (game.targetWord.length + 1));
  };

  // TODO: Move this to the game utils eventually
  const getGuessedCharacters = () => {
    const characters: Array<number> = [];

    game.guesses.forEach((guess: Guess) => {
      guess.validity.forEach((validity, index) => {
        if (validity === LetterValidity.VALID && !characters.includes(index)) {
          characters.push(index);
        }
      });
    });

    return characters;
  };

  const word = () => {
    if (game.status === Status.PLAYING) {
      return (
        <div data-testid="wordinput">
          <Word
            targetWord={game.targetWord}
            input={input}
            colorize={false}
            guessedLetters={getGuessedCharacters()}
          />
        </div>
      );
    }
  };

  // Hook
  useKeypress(handleKeyPressed);

  return (
    <div className="App flex flex-col gap-10">
      <h1>Passwordle</h1>
      <div className="board flex flex-col gap-2" data-testid="board">
        <Guesses
          target={game.targetWord}
          guesses={game.guesses}
          isRevealing={isRevealing}
        />
        {word()}
      </div>
      <Keyboard
        targetWord={game.targetWord}
        guesses={game.guesses}
        alphabet={game.alphabet}
        callback={handleKeyPressed}
      />
    </div>
  );
}
export default App;
