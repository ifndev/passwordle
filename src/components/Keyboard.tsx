import { Guess, CharType, checkType } from "../helpers/gameUtils";
import { useState } from "react";

function Keyboard({
  targetWord,
  guesses,
  alphabet,
  callback,
}: {
  targetWord: string;
  guesses: Guess[];
  alphabet: string[];
  callback: Function;
}) {
  const [upperCase, setUppercase] = useState(false);

  const layoutLower = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter"],
    ["Caps", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
  ];

  const layoutUpper = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter"],
    ["Caps", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];

  const layout = upperCase ? layoutUpper : layoutLower;

  const symbols = alphabet.filter((key) => {
    // Keep only symbols
    return checkType(key) === CharType.SYMBOL;
  });
  layout.push(symbols);

  const guessedWords = guesses.map((guess) => {
    return guess.guessedWord;
  });

  /// Tried characters
  const triedLetters = guessedWords.join("").split("");

  /// Guessed characters (somewhere in the word)
  const guessedLetters = triedLetters.filter((letter) => {
    return targetWord.includes(letter);
  });

  /// Correctly placed letters (in the correct position)
  const correctlyPlacedLetters: string[] = [];
  targetWord.split("").forEach((letter, index) => {
    guessedWords.forEach((guess) => {
      if (guess[index] === letter && !correctlyPlacedLetters.includes(letter)) {
        correctlyPlacedLetters.push(letter);
      }
    });
  });

  /// Get a line of keys
  const getKeyboardLine = (characters: Array<string>) => {
    return characters.map((key, index) => {
      let style = "";
      if (correctlyPlacedLetters.includes(key.toLowerCase()))
        style = "bg-green-700";
      else if (guessedLetters.includes(key.toLowerCase()))
        style = "bg-yellow-700";
      else if (triedLetters.includes(key.toLowerCase()))
        style = "border-gray-700 text-gray-700";

      return (
        <div
          key={index}
          className={`border md:border-2 border-gray-400 p-0 md:p-2 ${style} select-none h-9 md:h-auto w-6 md:w-8 justify-center align-middle`}
          data-testid={`keyboard-key-${key}`}
          onClick={
            key === "Caps"
              ? () => setUppercase(!upperCase)
              : () => callback(key)
          }
        >
          {getDisplayKey(key)}
        </div>
      );
    });
  };

  const getDisplayKey = (key: string) => {
    if (key === "Enter") return "↵";
    if (key === "Backspace") return "⌫";
    if (key === "Caps") return upperCase ? "⇧" : "⇪";
    return key;
  };

  const keys = layout.map((line, index) => {
    return (
      <div className="flex flex-row justify-center gap-1 md:gap-2">
        {getKeyboardLine(line)}
      </div>
    );
  });

  return (
    <div
      className="flex flex-col justify-center gap-1 md:gap-2"
      data-testid="keyboard"
    >
      {keys}
    </div>
  );
}

export default Keyboard;
