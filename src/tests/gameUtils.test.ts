import {
  getRandomWord,
  getAlphabet,
  calculateBudget,
  checkType,
  checkGuess,
  LetterValidity,
  isCharacterMisplaced,
  CharType,
} from "../helpers/gameUtils";
import passwords from "../helpers/passwords";

const expectedAlphabet = [
  "a",
  "A",
  "b",
  "B",
  "c",
  "C",
  "d",
  "D",
  "e",
  "E",
  "f",
  "F",
  "g",
  "G",
  "h",
  "H",
  "i",
  "I",
  "j",
  "J",
  "k",
  "K",
  "l",
  "L",
  "m",
  "M",
  "n",
  "N",
  "o",
  "O",
  "p",
  "P",
  "q",
  "Q",
  "r",
  "R",
  "s",
  "S",
  "t",
  "T",
  "u",
  "U",
  "v",
  "V",
  "w",
  "W",
  "x",
  "X",
  "y",
  "Y",
  "z",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "_",
  ".",
  "*",
  "'",
  "-",
  "+",
  "&",
  ";",
  "!",
  "?",
];

describe("alphabet generation", () => {
  it("generates the correct alphabet", () => {
    const alphabet = getAlphabet(passwords);
    expect(alphabet).toEqual(expectedAlphabet);
  });
});

describe("budget calculation", () => {
  it("calculates the budget correctly on a lowercase word", () => {
    const budget = calculateBudget("test12*");
    expect(budget).toEqual({
      t: 2,
      e: 1,
      s: 1,
      "1": 1,
      "2": 1,
      "*": 1,
    });
  });

  it("counts all letters as lowercase", () => {
    const budget = calculateBudget("Test");
    expect(budget).toEqual({
      t: 2,
      e: 1,
      s: 1,
    });
  });
});

describe("random word picking", () => {
  it("picks a random word", () => {
    const word = getRandomWord(passwords);
    expect(word).toBeTruthy();
    expect(passwords).toContain(word);
  });
});

describe("character type checker", () => {
  it("correctly identifies a letter", () => {
    expect(checkType("a")).toEqual(CharType.LETTER);
  });

  it("correctly identifies a number", () => {
    expect(checkType("1")).toEqual(CharType.NUMBER);
  });

  it("correctly identifies a special character", () => {
    expect(checkType("*")).toEqual(CharType.SYMBOL);
  });
});

describe("misplaced letter detection", () => {
  const targetWord = "test";
  it("identified a letter as misplaced correctly", () => {
    expect(isCharacterMisplaced(2, "eete", targetWord)).toEqual(true);
  });

  it("identified a letter as not misplaced if it is correctly guessed", () => {
    expect(isCharacterMisplaced(0, "t3sr", targetWord)).toEqual(false);
  });

  it("identified a letter as not misplaced if it is not in the word", () => {
    expect(isCharacterMisplaced(0, "x3sr", targetWord)).toEqual(false);
  });

  it("identified a letter as not misplaced if we placed it more times than it appears in the word", () => {
    expect(isCharacterMisplaced(0, "tttx", targetWord)).toEqual(false); // Well-placed
    expect(isCharacterMisplaced(1, "tttx", targetWord)).toEqual(true); // Misplaced
    expect(isCharacterMisplaced(2, "tttx", targetWord)).toEqual(false); // Budget exhausted -> not misplaced
  });

  it("identified a letter as not misplaced if we placed it correctly later in the word", () => {
    expect(isCharacterMisplaced(0, "eest", targetWord)).toEqual(false); // The letter is also placed correctly later in the word so we consider it not misplaced
  });

  it("deejay", () => {
    expect(isCharacterMisplaced(0, "aaaaaa", "deejay")).toEqual(false);
    expect(isCharacterMisplaced(1, "aaaaaa", "deejay")).toEqual(false);
    expect(isCharacterMisplaced(2, "aaaaaa", "deejay")).toEqual(false);
    expect(isCharacterMisplaced(3, "aaaaaa", "deejay")).toEqual(false);
    expect(isCharacterMisplaced(4, "aaaaaa", "deejay")).toEqual(false);
    expect(isCharacterMisplaced(5, "aaaaaa", "deejay")).toEqual(false);
  });
});

describe("guess evaluation", () => {
  const targetWord = "t3sT*";

  it("throws if the guess is an incorrect size", () => {
    expect(() => checkGuess("t", targetWord)).toThrow();
  });

  it("handles a valid guess correctly", () => {
    const validity = checkGuess("t3sT*", targetWord);
    expect(validity).toEqual([
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
    ]);
  });

  it("handles a wrongtype guess correctly", () => {
    expect(checkGuess("t3sTe", targetWord)).toEqual([
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.WRONGTYPE,
    ]);
  });

  it("handles a misplaced guess correctly", () => {
    expect(checkGuess("t3s*!", targetWord)).toEqual([
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.MISPLACED,
      LetterValidity.INVALID,
    ]);
  });

  it("handles a wrongcase guess correctly", () => {
    expect(checkGuess("t3st*", targetWord)).toEqual([
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.WRONGCASE,
      LetterValidity.VALID,
    ]);
  });

  it("handles an invalid guess correctly", () => {
    expect(checkGuess("t3so!", targetWord)).toEqual([
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.VALID,
      LetterValidity.INVALID,
      LetterValidity.INVALID,
    ]);
  });

  it("deejay", () => {
    expect(checkGuess("aaaaaa", "deejay")).toEqual([
      LetterValidity.INVALID,
      LetterValidity.INVALID,
      LetterValidity.INVALID,
      LetterValidity.INVALID,
      LetterValidity.VALID,
      LetterValidity.INVALID,
    ]);
  });
});
