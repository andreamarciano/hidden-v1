import { useEffect, useRef, useState } from "react";
import "./MeltingDiv.css";
import { useTrash } from "../trash/TrashContext";

const MeltingDiv = ({ children }) => {
  /* === SOUND SETUP === */
  const soundURL = {
    lava: { src: "/sounds/about/lava5.mp3", volume: 0.5 },
    melting: { src: "/sounds/about/lava2.mp3", volume: 0.9 },
    steam: { src: "/sounds/about/steam.mp3", volume: 0.3 },
  };

  const audioRefs = useRef({
    lava: null,
    steam: null,
    melting: null,
  });

  // Play looped sound (e.g. lava bubbling)
  const playLoopedSound = (key) => {
    const sound = soundURL[key];
    if (!sound) return;

    if (!audioRefs.current[key]) {
      const audio = new Audio(sound.src);
      audio.loop = true;
      audio.volume = sound.volume ?? 1.0;
      audioRefs.current[key] = audio;
    }

    const audio = audioRefs.current[key];
    if (audio.paused) audio.play();
  };
  // Stop looped sound
  const stopSound = (key) => {
    const audio = audioRefs.current[key];
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  // Play one-shot sound (e.g. steam burst or melting effect)
  const playOneShot = (key) => {
    const sound = soundURL[key];
    if (!sound) return;
    const audio = new Audio(sound.src);
    audio.volume = sound.volume ?? 1.0;
    audio.play();
  };

  // === STATE & CONTEXT ===
  const { addToTrash } = useTrash(); // context
  const [hovering, setHovering] = useState(false);
  const [heatLevel, setHeatLevel] = useState(0);
  const [melting, setMelting] = useState(false);
  const [showSteam, setShowSteam] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const timerRef = useRef(null);
  const hoverStartTimeRef = useRef(null);

  // === DIV Color logic ===
  // Gradually interpolate from yellow (heatLevel 0) to red (heatLevel 1)
  const getInterpolatedColor = (level) => {
    const hue = 50 - level * 50;
    return `hsl(${hue}, 100%, 70%)`;
  };

  // === HEAT BUILD-UP & MELTING TRIGGER ===
  useEffect(() => {
    if (isDead) return;

    if (hovering) {
      playLoopedSound("lava");

      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 100;
        setHeatLevel(Math.min(1, elapsed / 5000));
        if (elapsed >= 5000) {
          // Trigger melting sequence
          clearInterval(timerRef.current);
          stopSound("lava");
          setMelting(true);
          hoverStartTimeRef.current = null;
        }
      }, 100);
    } else {
      // Cooling down when not hovering
      clearInterval(timerRef.current);
      stopSound("lava");

      const cooldown = setInterval(() => {
        setHeatLevel((prev) => {
          const next = Math.max(0, prev - 0.05);
          if (next === 0) clearInterval(cooldown);
          return next;
        });
      }, 100);
    }

    return () => {
      clearInterval(timerRef.current);
      stopSound("lava");
    };
  }, [hovering, isDead]);

  /* === TEXT EXTRACTION ON MELT → TRASH === */
  useEffect(() => {
    if (melting) {
      playOneShot("melting");
      const timeout = setTimeout(() => {
        const extractText = (node) => {
          if (typeof node === "string") return node;
          if (Array.isArray(node)) return node.map(extractText).join(" ");
          if (node?.props?.children) return extractText(node.props.children);
          return "";
        };
        const text = extractText(children);
        addToTrash(text);

        setIsDead(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [melting]);

  // === MOUSE EVENTS ===
  const handleMouseEnter = () => {
    if (isDead) return;
    setHovering(true);
    hoverStartTimeRef.current = Date.now();
  };

  const handleMouseLeave = () => {
    if (isDead || melting) return;
    setHovering(false);

    const hoverDuration = Date.now() - hoverStartTimeRef.current;

    if (hoverDuration >= 2000 && heatLevel > 0) {
      playOneShot("steam");
      setShowSteam(true);
      setTimeout(() => setShowSteam(false), 1500);
    }
  };

  // === VISUAL PROPERTIES ===
  const bgColor = getInterpolatedColor(heatLevel);
  const shake = heatLevel > 0.7 && !melting ? "animate-shake" : "";
  const lapilliColors = ["#ff4500", "#ff8c00", "#ffd700"];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: `linear-gradient(to right, ${bgColor}, ${bgColor})`,
        transition: "background 0.2s linear",
      }}
      className={`relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center p-2 m-10 rounded-4xl shadow-2xl shadow-red-500 transition-all duration-300 ${
        melting ? "animate-melt" : ""
      } ${shake}`}
    >
      {children}

      {/* Lapilli */}
      {Array.from({ length: Math.floor(heatLevel * 10) }).map((_, i) => {
        const color =
          lapilliColors[Math.floor(Math.random() * lapilliColors.length)];
        return (
          <span
            key={i}
            className="absolute top-0 w-2 h-2 rounded-full opacity-70 animate-lapilli"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: color,
              animationDelay: `${Math.random()}s`,
            }}
          ></span>
        );
      })}

      {/* Drip */}
      {!melting && heatLevel > 0.5 && (
        <>
          <div
            className="drip-chunk rotate-drip-left"
            style={{
              left: "12%",
              width: "14px",
              height: "28px",
              backgroundColor: getInterpolatedColor(heatLevel),
              animationDelay: "0.4s",
            }}
          />
          <div
            className="drip-chunk"
            style={{
              left: "28%",
              width: "20px",
              height: "40px",
              backgroundColor: getInterpolatedColor(heatLevel),
              animationDelay: "1.2s",
            }}
          />
          <div
            className="drip-chunk rotate-drip-right"
            style={{
              left: "38%",
              width: "10px",
              height: "22px",
              backgroundColor: getInterpolatedColor(heatLevel),
              animationDelay: "1.5s",
            }}
          />
          <div
            className="drip-chunk"
            style={{
              left: "52%",
              width: "18px",
              height: "35px",
              backgroundColor: getInterpolatedColor(heatLevel),
              animationDelay: "1.9s",
            }}
          />
          <div
            className="drip-chunk"
            style={{
              left: "63%",
              width: "12px",
              height: "30px",
              backgroundColor: getInterpolatedColor(heatLevel),
              animationDelay: "2.2s",
            }}
          />
          <div
            className="drip-chunk rotate-drip-left"
            style={{
              left: "78%",
              width: "16px",
              height: "38px",
              backgroundColor: getInterpolatedColor(heatLevel),
              animationDelay: "2.6s",
            }}
          />
          <div
            className="drip-chunk rotate-drip-right"
            style={{
              left: "88%",
              width: "14px",
              height: "25px",
              backgroundColor: getInterpolatedColor(heatLevel),
              animationDelay: "3.1s",
            }}
          />
        </>
      )}

      {/* Steam particles */}
      {showSteam &&
        Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`steam-${i}`}
            className="absolute w-12 h-12 bg-white opacity-20 animate-steam"
            style={{
              left: `${10 + i * 10}%`,
              bottom: `${60 + Math.random() * 10}px`,
              borderRadius: "50% / 60%",
              filter: "blur(8px)",
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
    </div>
  );
};

export default MeltingDiv;
