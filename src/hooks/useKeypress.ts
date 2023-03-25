import { useEffect } from "react";

function useKeyPress(callback: Function) {
  // Add event listeners
  useEffect(() => {
    function downHandler({ key }: { key: string }) {
      callback(key);
    }

    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [callback]); // Empty array ensures that effect is only run on mount and unmount
}

export default useKeyPress;
