import Letter from "./Letter";
import { LetterValidity } from "../helpers/gameUtils";

function Word({
  targetWord,
  input,
  colorize,
  guessedLetters,
  validity,
}: {
  targetWord: string;
  input: string;
  colorize: boolean;
  guessedLetters?: Array<number>;
  validity?: Array<LetterValidity>;
}) {
  const isGuessed = (index: number) => {
    if (!guessedLetters) return false;
    return guessedLetters.includes(index);
  };

  const list = targetWord.split("").map((letter, index) => {
    let inputLetter = index < input.length ? input[index] : undefined;

    return (
      <Letter
        key={index}
        input={inputLetter}
        target={letter}
        targetWord={targetWord}
        colorize={colorize}
        placeholder={isGuessed(index) ? letter : " "}
        validity={validity ? validity[index] : LetterValidity.INVALID}
      />
    );
  });

  return (
    <div className="flex flex-row gap-2 justify-center" data-testid="word">
      {list}
    </div>
  );
}

export default Word;
