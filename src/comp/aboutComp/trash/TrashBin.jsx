import { useState } from "react";
import { useTrash } from "./TrashContext";
import "./TrashBin.css";

const TrashBin = () => {
  const { pendingLetters, fallingLetters, dumpTrash } = useTrash(); // context
  const [isDumping, setIsDumping] = useState(false);

  // Tilt Trash Bin
  const handleClick = () => {
    if (pendingLetters.length === 0) return;
    setIsDumping(true);

    // ~160°
    setTimeout(() => {
      dumpTrash();
    }, 300);

    setTimeout(() => {
      setIsDumping(false);
    }, 1200);
  };

  return (
    <div className="flex justify-center mt-8 relative h-2 w-max">
      <div
        onClick={handleClick}
        className={`text-4xl cursor-pointer relative left-10 z-10 duration-300 ${
          pendingLetters.length > 0 && !isDumping ? "animate-bounce" : ""
        } ${isDumping ? "trash-tilt" : ""}`}
      >
        <img
          src={
            isDumping ? "/images/about/binOpen.svg" : "/images/about/bin.svg"
          }
          alt="Trash Bin"
          className="w-8 h-8"
        />
        {pendingLetters.length > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {pendingLetters.length}
          </span>
        )}
      </div>

      {/* Falling Letters */}
      {fallingLetters.map((char, i) => (
        <span
          key={i}
          className="absolute text-gray-700 text-sm animate-letter-fall"
          style={{
            top: "2rem",
            left: `${60 + Math.random() * 20 - 10}px`,
            transform: `rotate(${Math.random() * 40 - 20}deg)`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default TrashBin;
