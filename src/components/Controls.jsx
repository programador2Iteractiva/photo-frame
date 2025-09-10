import { useCameraContext } from "../context/CameraContext";
import useIsMobile from "../hooks/useIsMobile";
import { FaCameraRotate } from "react-icons/fa6";

const Controls = () => {
  const {
    handleCapture,
    orientation,
    toggleOrientation,
  } = useCameraContext();

  const isMobile = useIsMobile();

  return (
    <div className="p-6 gap-4 flex items-center justify-center md:flex-col">
      {/* Botón de captura */}
      {isMobile ? (
        <button
          onClick={handleCapture}
          className="bg-white w-24 h-24 rounded-full border shadow active:scale-95 transition"
          aria-label="Tomar foto"
          title="Tomar foto"
        />
      ) : (
        <button
          onClick={handleCapture}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200 flex items-center justify-center"
        >
          Tomar Foto
        </button>
      )}

      {/* Alternar orientación */}
      <button
        onClick={toggleOrientation}
        className="flex justify-center items-center w-24 h-24 rounded-full border shadow active:scale-95 transition"
        aria-label="Alternar orientación"
        title="Alternar orientación Horizontal/Vertical"
      >
        <FaCameraRotate className="w-18 h-18" />
      </button>


    </div>
  );
};

export default Controls;
