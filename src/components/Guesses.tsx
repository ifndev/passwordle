import Word from "./Word";
import { Guess } from "../helpers/gameUtils";

function Guesses({
  target,
  guesses,
}: {
  target: string;
  guesses: Array<Guess>;
}) {
  const triesList = guesses.map((guess, index) => {
    return (
      <Word
        key={index}
        targetWord={target}
        input={guess.guessedWord}
        colorize={true}
        validity={guess.validity}
      />
    );
  });
  return (
    <div className="flex flex-col gap-2" data-testid="guesses">
      {triesList}
    </div>
  );
}

export default Guesses;
