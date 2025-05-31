import { useRef, useState, useEffect } from "react";
import { useTrash } from "../trash/TrashContext";

const TiltDiv = () => {
  const debug = false;
  // const debug = true;

  const containerRef = useRef(null);
  const [angle, setAngle] = useState(0);
  const angleRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [phase2Active, setPhase2Active] = useState(false);
  const startY = useRef(0);
  const initialAngle = useRef(0);
  const maxAngle = 70;
  const threshold = 50;
  const { addToTrash } = useTrash(); // context

  /* === SOUND SETUP === */
  const soundURL = {
    drop: { src: "/sounds/about/drop.mp3", volume: 0.8 },
    fallingLetters: { src: "/sounds/about/fallingLetters.mp3", volume: 1 },
  };

  const playSound = (key) => {
    const sound = soundURL[key];
    if (!sound) return;

    const audio = new Audio(sound.src);
    audio.volume = sound.volume ?? 1.0;
    audio.play();
  };

  const fallingAudio = useRef(null);
  const startFallingLoop = () => {
    const sound = soundURL.fallingLetters;
    if (!sound) return;

    fallingAudio.current = new Audio(sound.src);
    fallingAudio.current.volume = sound.volume ?? 1.0;
    fallingAudio.current.loop = true;
    fallingAudio.current.play();
  };
  const stopFallingLoop = () => {
    if (fallingAudio.current) {
      fallingAudio.current.pause();
      fallingAudio.current.currentTime = 0;
      fallingAudio.current = null;
    }
  };

  /* === DIV CONTENT === */
  const content = (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Our Mission</h2>
      <p className="text-gray-600 max-w-2xl mb-2">
        Our goal is to revolutionize the concept of eggs. We don’t just sell
        eggs — we sell experiences! Our mission is to combine science,
        innovation, and a pinch of madness to create the best product possible.
      </p>
    </>
  );

  /* === TEXT PREP === */
  const [blocks, setBlocks] = useState([]);
  // Recursively extract plain text and styles from React nodes
  const extractStyledBlocks = (node, parentStyle = {}) => {
    if (typeof node === "string") {
      return [
        {
          id: Math.random().toString(36).slice(2, 11),
          style: parentStyle,
          letters: node.split("").map((char) => ({
            char,
            fallen: false,
            id: Math.random().toString(36).slice(2, 11),
            fallStyle: {
              rotate: Math.random() * 180 - 30,
              x: Math.random() * 300 - 150,
              y: 300 + Math.random() * 300,
            },
          })),
        },
      ];
    }

    if (Array.isArray(node)) {
      return node.flatMap((child) => extractStyledBlocks(child, parentStyle));
    }

    if (node?.props?.children) {
      const newStyle = { ...parentStyle };
      const className = node.props.className || "";

      if (node.type === "strong") newStyle.fontWeight = "bold";
      if (node.type === "h2") {
        newStyle.fontSize = "1.5rem";
        newStyle.fontWeight = "600";
        newStyle.marginBottom = "0.2rem";
      }
      if (node.type === "p") {
        newStyle.marginBottom = "0.2rem";
      }

      if (className.includes("text-2xl")) newStyle.fontSize = "1.5rem";
      if (className.includes("font-semibold")) newStyle.fontWeight = "600";
      if (className.includes("text-gray-700")) newStyle.color = "#374151";
      if (className.includes("text-gray-600")) newStyle.color = "#4B5563";

      return extractStyledBlocks(node.props.children, newStyle);
    }

    return [];
  };

  // Extract text from the fixed content
  useEffect(() => {
    const styledBlocks = extractStyledBlocks(content);
    setBlocks(styledBlocks);
  }, []);

  // --- Mouse down: start dragging ---
  const handleMouseDown = (e) => {
    setDragging(true);
    startY.current = e.clientY;
    initialAngle.current = angleRef.current;

    if (debug) {
      console.log("🟢 Mouse down - Start dragging");
      console.log("Start Y:", startY.current);
      console.log("Initial angle:", initialAngle.current);
    }

    // Disable global text selection
    document.body.style.userSelect = "none";
  };

  // --- Mouse move: update rotation based on movement ---
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dy = startY.current - e.clientY;
    const sensitivity = 10;
    let newAngle = initialAngle.current + dy / sensitivity;
    if (newAngle < 0) newAngle = 0;
    if (newAngle > maxAngle) newAngle = maxAngle;

    angleRef.current = newAngle;
    setAngle(newAngle);

    if (debug) console.log("↔️ Mouse move - Angle updated:", newAngle);
  };

  // --- Mouse up: stop dragging and reset angle if needed ---
  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = ""; // Restore text selection

    if (debug) {
      console.log("🔴 Mouse up - Stop dragging");
      console.log("Final angle (ref):", angleRef.current);
    }

    angleRef.current = 0;
    setAngle(0);
    setTimeout(() => {
      playSound("drop");
    }, 200);
    if (debug) console.log("🔁 Resetting angle to 0");
  };

  /* Dynamically activate/deactivate Phase 2 */
  useEffect(() => {
    if (angle >= threshold && !phase2Active) {
      if (debug) console.log("✅ Entering Phase 2 (angle >= threshold)");
      setPhase2Active(true);
      startFallingLoop();
    } else if (angle < threshold && phase2Active) {
      setTimeout(() => {
        setPhase2Active(false);
        stopFallingLoop();
        if (debug) console.log("⏪ Exiting Phase 2 (angle < threshold)");
      }, 400);
    }
  }, [angle, phase2Active]);

  /* === Progressive letter drop animation === */
  useEffect(() => {
    if (!phase2Active) return;

    const interval = setInterval(() => {
      setBlocks((oldBlocks) => {
        // All letters have fallen
        const allFallen = oldBlocks.every((block) =>
          block.letters.every((l) => l.fallen)
        );
        if (allFallen) {
          setPhase2Active(false);
          clearInterval(interval);
          stopFallingLoop();
          return oldBlocks;
        }

        for (let b = 0; b < oldBlocks.length; b++) {
          const block = oldBlocks[b];
          const idx = block.letters.findIndex((l) => !l.fallen);
          if (idx !== -1) {
            const updatedBlocks = [...oldBlocks];
            const updatedBlock = { ...block };
            updatedBlock.letters = [...block.letters];
            updatedBlock.letters[idx] = {
              ...updatedBlock.letters[idx],
              fallen: true,
            };
            updatedBlocks[b] = updatedBlock;

            setTimeout(() => addToTrash(updatedBlock.letters[idx].char), 500);
            return updatedBlocks;
          }
        }
        setPhase2Active(false);
        clearInterval(interval);
        stopFallingLoop();
        return oldBlocks;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [phase2Active, blocks, addToTrash]);

  /* === Mouse events based on dragging state === */
  useEffect(() => {
    if (dragging) {
      if (debug) console.log("🎯 Adding mouse event listeners");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      if (debug) console.log("🚫 Removing mouse event listeners");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = ""; // Failsafe reset
    };
  }, [dragging]);

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto my-6 ${
        dragging ? "cursor-grabbing select-none" : ""
      }`}
    >
      {/* --- Drag handle area --- */}
      <div
        className={`absolute top-0 right-0 w-6 h-full z-20 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
      />

      {/* --- Tiltable container --- */}
      <div
        ref={containerRef}
        style={{
          transform: `rotateZ(-${angle}deg)`,
          transformOrigin: "left center",
          transition: dragging ? "none" : "transform 0.4s ease",
          // fixed dimensions
          minHeight: "4rem",
          minWidth: "100%",
          position: "relative",
          overflow: "hidden",
        }}
        className={`bg-gradient-to-r from-orange-200 via-green-200 to-blue-200 
          rounded-tr-3xl rounded-bl-3xl shadow-2xl shadow-blue-600/80 
          p-4 text-center ${dragging ? "select-none" : ""}`}
      >
        {/* Render each letter with its associated style */}
        {blocks.map((block) => (
          <div key={block.id} style={{ ...block.style, display: "block" }}>
            {block.letters.map(({ char, fallen, id, fallStyle }) => (
              <span
                key={id}
                className="inline-block relative transition-transform duration-500 ease-in-out falling-letter"
                style={{
                  transform: fallen
                    ? `translate(${fallStyle.x}px, ${fallStyle.y}px) rotate(${fallStyle.rotate}deg)`
                    : "none",
                  opacity: fallen ? 0 : 1,
                  transition: `transform 1.2s ease-in, opacity 0.6s ease-out`,
                  transitionDelay: fallen ? `${Math.random() * 0.2}s` : "0s",
                  whiteSpace: "pre",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                  pointerEvents: "none",
                  userSelect: "none",
                  ...block.style,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TiltDiv;
