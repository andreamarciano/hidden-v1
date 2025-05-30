import { createContext, useContext, useState } from "react";

const TrashContext = createContext();

export const useTrash = () => useContext(TrashContext);

export const TrashProvider = ({ children }) => {
  const [pendingLetters, setPendingLetters] = useState([]);
  const [fallingLetters, setFallingLetters] = useState([]);
  const [dumpedLetters, setDumpedLetters] = useState([]);

  // Add to Trash Collector
  const addToTrash = (text) => {
    const letters = text.split("").filter((char) => char.trim().length > 0);
    setPendingLetters((prev) => [...prev, ...letters]);
  };

  /* === LETTER MASK === */
  /* H Mask */
  const isInHMask = (x, y) => {
    const leftColumn = x >= 2 && x <= 6;
    const rightColumn = x >= 22 && x <= 26;
    const centerBar = y >= 40 && y <= 54 && x >= 6 && x <= 22;

    return leftColumn || rightColumn || centerBar;
  };

  /* I Mask */
  const isInIMask = (x, y) => {
    const centerColumn = x >= 38 && x <= 41 && y >= 10 && y <= 84;
    const topBar = y >= 10 && y <= 24 && x >= 31 && x <= 47;
    const bottomBar = y >= 70 && y <= 84 && x >= 31 && x <= 47;

    return centerColumn || topBar || bottomBar;
  };

  /* D Mask */
  const isInDMask = (x, y) => {
    const leftColumn = x >= 50 && x <= 53 && y >= 10 && y <= 84;
    const topBar = y >= 10 && y <= 24 && x >= 53 && x <= 63;
    const bottomBar = y >= 70 && y <= 84 && x >= 53 && x <= 63;
    const rightEdge = x >= 63 && x <= 66 && y >= 24 && y <= 70;

    return leftColumn || topBar || bottomBar || rightEdge;
  };

  /* E Mask */
  const isInEMask = (x, y) => {
    const leftColumn = x >= 69 && x <= 72 && y >= 10 && y <= 84;
    const topBar = y >= 10 && y <= 24 && x >= 68 && x <= 81;
    const middleBar = y >= 44 && y <= 54 && x >= 68 && x <= 78;
    const bottomBar = y >= 70 && y <= 84 && x >= 68 && x <= 81;

    return leftColumn || topBar || middleBar || bottomBar;
  };

  /* 5 Mask */
  const isIn5Mask = (x, y) => {
    const topBar = y >= 10 && y <= 24 && x >= 83 && x <= 96;
    const upperLeft = x >= 83 && x <= 86 && y >= 10 && y <= 44;
    const middleBar = y >= 44 && y <= 54 && x >= 83 && x <= 96;
    const lowerRight = x >= 93 && x <= 96 && y >= 54 && y <= 82;
    const bottomBar = y >= 70 && y <= 84 && x >= 83 && x <= 96;

    return topBar || upperLeft || middleBar || lowerRight || bottomBar;
  };

  const isInAnyMask = (x, y) => {
    return (
      isInHMask(x, y) ||
      isInIMask(x, y) ||
      isInDMask(x, y) ||
      isInEMask(x, y) ||
      isIn5Mask(x, y)
    );
  };

  // Letter position
  const generateLetterData = (char) => {
    let x, y;

    do {
      x = Math.random() * 100;
      y = Math.random() * 100;
    } while (isInAnyMask(x, y));

    return {
      char,
      top: `${y}%`,
      left: `${x}%`,
      rotate: `${Math.random() * 60 - 30}deg`,
      id: crypto.randomUUID(),
    };
  };

  // Dump Trash Collector
  const dumpTrash = () => {
    const letterData = pendingLetters.map((char) => generateLetterData(char));

    setFallingLetters([...pendingLetters]);

    setTimeout(() => {
      setDumpedLetters((prev) => [...prev, ...letterData]);
      setFallingLetters([]);
      setPendingLetters([]);
    }, 800);
  };

  return (
    <TrashContext.Provider
      value={{
        pendingLetters,
        fallingLetters,
        dumpedLetters,
        addToTrash,
        dumpTrash,
      }}
    >
      {children}
    </TrashContext.Provider>
  );
};
