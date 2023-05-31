import { useState } from "react";
import { LetterValidity } from "../helpers/gameUtils";
import { ANIMTIME } from "../constants/settings";

function Letter({
  input,
  position,
  validity,
  colorize,
  placeholder,
  isRevealing,
}: {
  input?: string;
  position: number;
  validity: LetterValidity;
  colorize: boolean;
  targetWord: string;
  placeholder: string;
  isRevealing?: boolean;
}) {
  const [doneRevealing, setDoneRevealing] = useState(false);

  if (!doneRevealing && isRevealing) {
    setTimeout(() => {
      setDoneRevealing(true);
    }, (position + 1) * ANIMTIME);
  }

  isRevealing = isRevealing || false;
  const animDelay = `${position * ANIMTIME}ms`;

  const getStyle = () => {
    if (isRevealing) {
      return {
        animation: `reveal ${ANIMTIME}ms ease-in`,
        animationDelay: animDelay,
        animationFillMode: "forwards",
      };
    } else {
      return {};
    }
  };

  /**
   * Return the color of the background depending on the input and target
   */
  const getColor = () => {
    // If colorization is disabled, return a lighter color
    if (!colorize) return "bg-gray-600";

    // If the letter is not done revealing, return a lighter color
    if (isRevealing && !doneRevealing) return "bg-gray-600";

    // If the input is undefined, return the default color
    if (!input) return "bg-gray-700";

    switch (validity) {
      case LetterValidity.VALID:
        return "bg-green-700";
      case LetterValidity.WRONGCASE:
        return "bg-yellow-700";
      case LetterValidity.WRONGTYPE:
        return "bg-red-700";
      default:
        return "bg-gray-700";
    }
  };

  /**
   * Return the border of the background depending on the input and target
   */
  const getBorder = () => {
    return validity === LetterValidity.MISPLACED &&
      (doneRevealing || !isRevealing)
      ? "border-2 border-orange-700"
      : "";
  };

  const getTextColor = () => {
    if (!input) return "text-gray-400";
    return "text-white";
  };

  return (
    <div
      className={`flex aspect-square w-7 md:w-11 text-sm md:text-2xl align-middle justify-center ${getColor()} ${getBorder()} ${getTextColor()} rounded-md z-10`}
      style={getStyle()}
    >
      {input || placeholder}
    </div>
  );
}

export default Letter;
