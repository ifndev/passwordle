import { Guess } from "../helpers/gameUtils";

function Keyboard({
  targetWord,
  guesses,
  alphabet,
}: {
  targetWord: string;
  guesses: Guess[];
  alphabet: string[];
}) {
  alphabet = alphabet.filter((key) => {
    // Remove uppercase letters
    return !key.match(/^[A-Z]$/);
  });

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

  const keys = alphabet.map((key, index) => {
    let style = "";
    if (correctlyPlacedLetters.includes(key)) style = "bg-green-700";
    else if (guessedLetters.includes(key)) style = "bg-yellow-700";
    else if (triedLetters.includes(key))
      style = "border-gray-700 text-gray-700";

    return (
      <div key={index} className={`border-2 border-gray-400 p-2 ${style}`}>
        {key}
      </div>
    );
  });

  return (
    <div className="grid grid-cols-10 gap-2" data-testid="keyboard">
      {keys}
    </div>
  );
}

export default Keyboard;
