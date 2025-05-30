import { useTrash } from "./TrashContext";
import DebugMask from "./DebugMask";

const TrashCollector = () => {
  const { dumpedLetters } = useTrash();

  return (
    <div className="relative top-8 h-48 mt-4 overflow-hidden">
      {/* Left border */}
      <div className="absolute top-0 left-0 bottom-0 w-0.5 z-1 bg-gray-500" />

      {/* Right border */}
      <div className="absolute top-0 right-0 bottom-0 w-0.5 z-1 bg-gray-500" />

      {/* Bottom border */}
      <div className="absolute left-0 right-0 bottom-0 h-1 z-1 bg-gray-500" />

      {/* Left Line */}
      <div
        className="absolute top-0 left-0 h-0.5 bg-gray-500"
        style={{ width: "45px" }}
      />

      {/* Right Line */}
      <div
        className="absolute top-0 left-[95px] h-0.5 bg-gray-500"
        style={{ right: 0 }}
      />

      {/* Hole */}
      <div className="absolute top-0 left-[45px] w-0.5 h-2 bg-gray-500" />
      <div className="absolute top-0 left-[95px] w-0.5 h-2 bg-gray-500" />

      {/* Letters */}
      {dumpedLetters.map(({ char, top, left, rotate, id }) => (
        <span
          key={id}
          className="absolute text-base sm:text-lg text-gray-700 opacity-80 select-none pointer-events-none transition-transform"
          style={{
            top,
            left,
            transform: `rotate(${rotate})`,
          }}
        >
          {char}
        </span>
      ))}

      {/* Debug Mask */}
      {/* <DebugMask /> */}
    </div>
  );
};

export default TrashCollector;
