import "./FallingDiv.css";
import { useState, useEffect } from "react";
import { useTrash } from "../trash/TrashContext";

const soundURL = {
  pop: { src: "/sounds/about/pop.mp3", volume: 0.4 },
  creaks: { src: "/sounds/about/creaks.mp3", volume: 0.5 },
  woosh: { src: "/sounds/about/woosh.mp3", volume: 0.5 },
};

const playSound = (key) => {
  const sound = soundURL[key];
  if (!sound) return;

  const audio = new Audio(sound.src);
  audio.volume = sound.volume ?? 1.0;
  audio.play();
};

const FallingDiv = ({ children }) => {
  const { addToTrash } = useTrash(); // context

  const [rightPinRemoved, setRightPinRemoved] = useState(false);
  const [leftPinRemoved, setLeftPinRemoved] = useState(false);
  const [rightPinFalling, setRightPinFalling] = useState(false);
  const [leftPinFalling, setLeftPinFalling] = useState(false);
  const [divFalling, setDivFalling] = useState(false);

  /* Animation Sequence: Pin Removed → Swing → Fall */
  useEffect(() => {
    if (rightPinRemoved && !leftPinRemoved) {
      playSound("creaks");

      const timer = setTimeout(() => {
        setLeftPinFalling(true);
        setTimeout(() => setLeftPinRemoved(true), 1000);
        playSound("pop");

        setDivFalling(true);
        setTimeout(() => playSound("woosh"), 100);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [rightPinRemoved]);

  // Remove Pin
  const handleRightPinClick = () => {
    setRightPinFalling(true);
    playSound("pop");

    setTimeout(() => setRightPinRemoved(true), 1000);
  };

  // Current State
  const divState = divFalling ? "fall" : rightPinRemoved ? "swing" : "still";

  /* EXTRACT TEXT → TRASH */
  useEffect(() => {
    if (divFalling) {
      const extractText = (node) => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractText).join(" ");
        if (node?.props?.children) return extractText(node.props.children);
        return "";
      };

      const text = extractText(children);
      addToTrash(text);
    }
  }, [divFalling]);

  return (
    <div className="relative inline-block pt-4 mb-8">
      {/* Left Pin */}
      {!leftPinRemoved && (
        <div
          className={`absolute top-0 left-0 z-10 text-xl select-none ${
            leftPinFalling ? "animate-pin-fall-left" : ""
          }`}
        >
          📌
        </div>
      )}

      {/* Right Pin (clickable) */}
      {!rightPinRemoved && (
        <div
          className={`absolute top-0 right-0 z-10 text-xl cursor-pointer select-none ${
            rightPinFalling ? "animate-pin-fall" : ""
          }`}
          onClick={handleRightPinClick}
        >
          📌
        </div>
      )}

      {/* Content div */}
      <div
        className={`bg-gradient-to-r from-orange-200 via-green-200 to-blue-200 rounded-br-3xl rounded-bl-3xl shadow-2xl shadow-blue-600/80 transition-transform origin-top-left ${
          divState === "swing"
            ? "animate-swing"
            : divState === "fall"
            ? "animate-fall"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default FallingDiv;
