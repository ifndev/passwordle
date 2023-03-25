type Guess = { guessedWord: string; validity: Array<LetterValidity> };

type Game = {
  targetWord: string;
  guesses: Array<Guess>;
  status: Status;
  alphabet: Array<string>;
  budget: { [key: string]: number };
  maxTries: number;
};

enum Status {
  WON,
  LOST,
  PLAYING,
}

enum LetterValidity {
  VALID,
  MISPLACED,
  WRONGCASE,
  WRONGTYPE,
  INVALID,
}

enum CharType {
  LETTER,
  NUMBER,
  SYMBOL,
}

function getRandomWord(wordlist: Array<string>) {
  return wordlist[Math.floor(Math.random() * wordlist.length)];
}

/**
 * Given a wordlist, returns an alphabet that contains all characters in the wordlist
 * The returned alphabet always contains letters a-z and A-Z, and numbers 0-9 even if they are not present in the wordlist
 * @param words wordlist to process
 * @returns alphabet
 */
function getAlphabet(words: Array<string>) {
  // Initialize alphabet
  let alphabet: Array<string> = [];
  // Add all letters a to z to the alphabet, both upper and lower case
  for (let i = 97; i < 123; i++) {
    alphabet.push(String.fromCharCode(i));
    alphabet.push(String.fromCharCode(i).toUpperCase());
  }
  // Add all numbers 0 to 9 to the alphabet
  for (let i = 48; i < 58; i++) {
    alphabet.push(String.fromCharCode(i));
  }

  // Iterate over all words and add all characters to the alphabet to ensure that none are missing
  words.forEach((word) => {
    word.split("").forEach((character) => {
      if (!alphabet.includes(character)) {
        alphabet.push(character);
      }
    });
  });

  return alphabet;
}

/**
 * Returns the budget for each letter in the word
 * The budget is the number of times that letter appears in the word
 * @param targetWord
 * @returns
 */
function calculateBudget(targetWord: string) {
  const budget: { [key: string]: number } = {};

  targetWord.split("").forEach((letter: string) => {
    letter = letter.toLowerCase();
    if (budget[letter]) {
      budget[letter]++;
    } else {
      budget[letter] = 1;
    }
  });

  return budget;
}

/**
 * Return which type of character the given character is
 * @param character
 * @returns
 */
function checkType(character: string) {
  if (character.match(/[a-zA-Z]/i)) {
    return CharType.LETTER;
  }
  if (character.match(/[0-9]/i)) {
    return CharType.NUMBER;
  }
  return CharType.SYMBOL;
}

/**
 * Returns true if the character at the given index should be considered misplaced
 * A character is misplaced if it is in the target word, but not in the correct position
 * There cannot be more misplaced characters X than there are Xs in the target word
 * More specifically (maxMisplaced = numberOfAppearancesInTargetWord - wellPlacedCharacters)
 *
 * Examples:
 *  Given the target word "maureen", if the guessed word is "eerie**"
 *
 *  E -> misplaced
 *  E -> not misplaced: the next E is in the correct position, and there are two in total in the target word so we only have one other E to spend, which is used for the first E
 *  R -> misplaced
 *  I -> not misplaced: there are no I's in the target word
 *  E -> not misplaced: it's in the correct position
 *  * -> not misplaced: there are no *'s in the target word
 *  * -> not misplaced: there are no *'s in the target word
 *
 * @param index the index of the character to check
 * @param guessedWord
 * @param targetWord
 * @returns
 */
function isCharacterMisplaced(
  index: number,
  guessedWord: string,
  targetWord: string
) {
  const targetLetter = targetWord[index];
  const guessedLetter = guessedWord[index];

  // If the letter is correctly placed, it is not misplaced
  if (targetLetter.toLowerCase() === guessedLetter.toLowerCase()) {
    return false;
  }

  // If the letter is not in the target word, it is not misplaced
  if (!targetWord.toLowerCase().includes(guessedLetter.toLowerCase())) {
    return false;
  }

  // We get the budget for the target word
  const budget = calculateBudget(targetWord);

  // For each letter from the start of the word to the current index, we remove one from the budget of that letter
  for (let i: number = 0; i < index; i++) {
    budget[guessedWord[i]]--;
  }

  // deduce from the budget further letters that are correctly placed
  for (let i = index + 1; i < targetWord.length - 1; i++) {
    const letter = guessedWord[i];
    if (letter) {
      if (letter.toLowerCase() === targetWord[i].toLowerCase()) {
        budget[letter]--;
      }
    }
  }

  // The budget for that letter is exhausted
  if (budget[guessedLetter] <= 0) {
    return false;
  }

  // The letter is existing but misplaced
  return true;
}

/**
 * Returns an array of LetterValidity, one for each character in the target word
 * @param guessedWord
 * @param targetWord
 * @returns
 */
function checkGuess(guessedWord: string, targetWord: string) {
  let validity: Array<LetterValidity> = [];

  targetWord.split("").forEach((targetLetter, index) => {
    validity.push(checkCharacter(index, guessedWord, targetWord));
  });

  return validity;
}

/**
 * Returns the validity of the character at the given index
 */
function checkCharacter(
  index: number,
  guessedWord: string,
  targetWord: string
) {
  const guessedChar = guessedWord[index];
  const targetChar = targetWord[index];
  if (targetChar === guessedChar) {
    return LetterValidity.VALID;
  } else if (isCharacterMisplaced(index, guessedWord, targetWord)) {
    return LetterValidity.MISPLACED;
  } else if (targetChar.toLowerCase() === guessedWord[index].toLowerCase()) {
    return LetterValidity.WRONGCASE;
  } else if (checkType(targetChar) !== checkType(guessedChar)) {
    return LetterValidity.WRONGTYPE;
  } else {
    return LetterValidity.INVALID;
  }
}

export {
  getRandomWord,
  getAlphabet,
  calculateBudget,
  checkType,
  isCharacterMisplaced,
  checkGuess,
  Status,
  LetterValidity,
  CharType,
};

export type { Game, Guess };
