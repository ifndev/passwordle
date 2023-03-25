import { LetterValidity } from "../helpers/gameUtils";

function Letter({
  input,
  target,
  validity,
  colorize,
  placeholder,
}: {
  input?: string;
  target: string;
  validity: LetterValidity;
  colorize: boolean;
  targetWord: string;
  placeholder: string;
}) {
  /**
   * Return the color of the background depending on the input and target
   */
  const getColor = () => {
    // If colorization is disabled, return a lighter color
    if (!colorize) return "bg-gray-600";

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
    return validity === LetterValidity.MISPLACED
      ? "border-2 border-orange-700"
      : "";
  };

  const getTextColor = () => {
    if (!input) return "text-gray-400";
    return "text-white";
  };

  return (
    <div
      className={`flex aspect-square w-11 text-2xl align-middle justify-center ${getColor()} ${getBorder()} ${getTextColor()} rounded-md`}
    >
      {input || placeholder}
    </div>
  );
}

export default Letter;
