import { describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { ANIMTIME } from "../constants/settings";

const user = userEvent.setup();

describe("App", () => {
  it("renders the h1", () => {
    render(<App target="coucou" />);
    expect(
      screen.getByRole("heading", { name: /Passwordle/i })
    ).toBeInTheDocument();
  });

  it("loads a random word if no target is passed", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /Passwordle/i })
    ).toBeInTheDocument();
  });

  it("renders the board", () => {
    render(<App target="coucou" />);
    // The Board is present in the dom
    expect(screen.getByTestId("board")).toBeInTheDocument();

    // The Guesses component is present in the DOM
    expect(screen.getByTestId("guesses")).toBeInTheDocument();

    // The Word component is present in the DOM
    expect(screen.getByTestId("word")).toBeInTheDocument();
  });

  it("hides the word input when the game is finished", async () => {
    render(<App target="coucou" />);

    // The Wordinput component is present in the DOM initially
    expect(screen.getByTestId("wordinput")).toBeInTheDocument();

    await user.keyboard("coucou");
    await user.keyboard("{enter}");

    // The Wordinput component is absent from the dom in the DOM initially
    expect(screen.queryByTestId("wordinput")).not.toBeInTheDocument();
  });

  it("colorizes the letter depending on the validity", async () => {
    render(<App target="aA$1'!" />);

    const guess = "bac1!'";
    // target : guess
    //   a    :   b  -> wrong     -> bg-gray-700
    //   A    :   a  -> wrongcase -> bg-yellow-700
    //   $    :   c  -> wrongtype  -> bg-red-700
    //   1    :   1  -> valid     -> bg-green-700
    //   '    :   !  -> misplaced -> bg-gray-700, border-orange-700
    //   !    :   '  -> misplaced -> bg-gray-700, border-orange-700

    // The Wordinput component is present in the DOM
    expect(screen.getByTestId("wordinput")).toBeInTheDocument();

    // Type the guess
    await user.keyboard(guess);

    // Enter
    await user.keyboard("{enter}");

    // Get the first "word" component in the dom which is not the word input
    const word = screen.queryAllByTestId("word")[0];

    // Get each letter in the word separately
    const letters = word.querySelectorAll("div");

    // Wait for the animation to be done
    await new Promise((r) => setTimeout(r, (guess.length + 1) * ANIMTIME));

    // Check the colors
    expect(letters.item(0)).toHaveClass("bg-gray-700");
    expect(letters.item(1)).toHaveClass("bg-yellow-700");
    expect(letters.item(2)).toHaveClass("bg-red-700");
    expect(letters.item(3)).toHaveClass("bg-green-700");
    expect(letters.item(4)).toHaveClass("bg-gray-700");
    expect(letters.item(5)).toHaveClass("bg-gray-700");

    // Check the border
    expect(letters.item(4)).toHaveClass("border-orange-700");
    expect(letters.item(5)).toHaveClass("border-orange-700");
  });

  it("does not count a letter as misplaced if it has been exhausted later in the word", async () => {
    render(<App target="1997" />);

    const guess = "1977";

    // target: guess
    //   1   :   1  -> valid     -> bg-green-700
    //   9   :   9  -> valid     -> bg-green-700
    //   9   :   7  -> wrong     -> bg-gray-700, no border  ---> exhausted right after
    //   7   :   7  -> valid     -> bg-green-700

    // Type the guess
    await user.keyboard(guess);

    // Enter
    await user.keyboard("{enter}");

    // Get the first "word" component in the dom which is not the word input
    const word = screen.queryAllByTestId("word")[0];

    // Get each letter in the word separately
    const letters = word.querySelectorAll("div");

    // Wait for the animation to be done
    await new Promise((r) => setTimeout(r, (guess.length + 1) * ANIMTIME));

    // Check the colors
    expect(letters.item(0)).toHaveClass("bg-green-700");
    expect(letters.item(1)).toHaveClass("bg-green-700");
    expect(letters.item(2)).toHaveClass("bg-gray-700");
    expect(letters.item(3)).toHaveClass("bg-green-700");

    // Check the border
    expect(letters.item(2)).not.toHaveClass("border-orange-700");
  });

  it("shows a placeholder if a letter is empty but has been guessed", async () => {
    render(<App target="coucou" />);
    await user.keyboard("cajoux");
    await user.keyboard("{enter}");

    // Get the word input
    const wordinput = screen
      .getByTestId("wordinput")
      .querySelector("[data-testid=word]");

    if (wordinput === null) throw new Error("wordinput is null");

    // Get the first letter
    const letter = wordinput.querySelectorAll("div").item(0);

    // Check if the placeholder is present
    expect(letter.innerHTML === "c").toBe(true);

    // Get the second letter
    const letter2 = wordinput.querySelectorAll("div").item(1);

    // Check that the placeholder is not present
    expect(letter2.innerHTML === "a").toBe(false);
  });

  it("colorizes key on the keyboard correctly", async () => {
    render(<App target="coucou" />);
    await user.keyboard("cajoux");
    await user.keyboard("{enter}");

    // Get the "u" key
    const ukey = screen.getByTestId("keyboard-key-u");
    // The "u" key should be marked as existing in the word, so it should have the class "bg-yellow-700"
    expect(ukey).toHaveClass("bg-yellow-700");

    // Get the "c" key
    const ckey = screen.getByTestId("keyboard-key-c");
    // The "c" key should be marked as correct, so it should have the class "bg-green-700"
    expect(ckey).toHaveClass("bg-green-700");

    // Get the "j" key
    const jkey = screen.getByTestId("keyboard-key-j");
    // The "j" key should be marked as wrong, so it should have the class "border-gray-700"
    expect(jkey).toHaveClass("border-gray-700");

    // Get the "v" key
    const vkey = screen.getByTestId("keyboard-key-v");
    // The v key hasn't been tried yet, so it should have none of these classes
    expect(vkey).not.toHaveClass("bg-yellow-700");
    expect(vkey).not.toHaveClass("bg-green-700");
    expect(vkey).not.toHaveClass("border-gray-700");

    // It should still have the default class "border-gray-400"
    expect(vkey).toHaveClass("border-gray-400");
  });

  it("the game ends if we reach the maximum number of guesses", async () => {
    render(<App target="coucou" maxGuesses={3} />);

    for (let i = 0; i < 3; i++) {
      await user.keyboard("cajoux");
      await user.keyboard("{enter}");
    }

    // The game should be over, thus, the word input should not be present
    expect(screen.queryByTestId("wordinput")).not.toBeInTheDocument();
  });
});
