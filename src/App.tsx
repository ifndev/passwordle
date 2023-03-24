import { useState, useEffect } from "react";
import passwords from "./helpers/passwords";
import Word from "./components/Word";
import Tries from "./components/Tries";
import Keyboard from "./components/Keyboard";
import useKeypress from "./hooks/useKeypress";
import "./App.css";

function App() {
  const [target, setTarget] = useState<string>("test");
  const [input, setInput] = useState<string>("");
  const [tries, setTries] = useState<string[]>([]);
  const [validLetters, setValidLetters] = useState<number[]>([]);

  // Initialize alphabet
  let validKeys: Array<string> = [];
  // Add all letters a to z to the alphabet, both upper and lower case
  for (let i = 97; i < 123; i++) {
    validKeys.push(String.fromCharCode(i));
    validKeys.push(String.fromCharCode(i).toUpperCase());
  }
  // Add all numbers 0 to 9 to the alphabet
  for (let i = 48; i < 58; i++) {
    validKeys.push(String.fromCharCode(i));
  }

  // Iterate over all passwords and add all letters to the alphabet to ensure that all letters and special characters are included
  passwords.forEach((password) => {
    password.split("").forEach((letter) => {
      if (!validKeys.includes(letter)) {
        validKeys.push(letter);
      }
    });
  });

  useEffect(() => {
    // Choose a target at random
    const newTarget = passwords[Math.floor(Math.random() * passwords.length)];
    setTarget(newTarget);

    console.log("Target is:" + newTarget);
  }, [setTarget]);

  /**
   * Check if the key is valid
   * @param key key to check
   * @returns boolean
   */
  const keyValid = (key: string) => {
    return validKeys.includes(key);
  };

  const onKeyPressed = (key: string) => {
    if (key === "Backspace") {
      popLetter();
    } else if (key === "Enter") {
      submitTry();
    } else if (keyValid(key)) {
      pushLetter(key);
    }
  };

  const pushLetter = (letter: string) => {
    if (input.length === target.length) return;
    setInput(input + letter);
  };

  const popLetter = () => {
    if (input.length === 0) return;
    setInput(input.slice(0, -1));
  };

  const tryValid = () => {
    return input.length === target.length;
  };

  const submitTry = () => {
    if (tryValid()) {
      setTries([...tries, input]);
      setInput("");

      let validLetters: Array<number> = [];
      input.split("").forEach((letter, index) => {
        if (letter.toLowerCase() === target[index].toLowerCase()) {
          validLetters.push(index);
        }
      });
      setValidLetters(validLetters);
    }
  };

  // Hooks
  useKeypress(onKeyPressed);

  return (
    <div className="App flex flex-col gap-10">
      <h1>Passwordle</h1>
      <div className="board flex flex-col gap-2">
        <Tries target={target} tries={tries} />
        <Word
          targetWord={target}
          input={input}
          colorize={false}
          validLetters={validLetters}
        />
      </div>
      <Keyboard targetWord={target} tries={tries} alphabet={validKeys} />
    </div>
  );
}
export default App;
