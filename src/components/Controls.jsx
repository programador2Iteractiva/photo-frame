import React from "react";
import { useCameraContext } from "../context/CameraContext";
import useIsMobile from "../hooks/useIsMobile";
import { FaCamera } from "react-icons/fa";
import { FaCameraRotate } from "react-icons/fa6";

const Controls = () => {
  const { handleCapture, toggleOrientation } = useCameraContext();
  const isMobile = useIsMobile();

  return (
    <div className="p-6 gap-4 flex items-center justify-center md:flex-col">
      {/* Botón de captura con icono de cámara */}
      {isMobile ? (
        <button
          onClick={handleCapture}
          className="bg-white w-24 h-24 rounded-full border shadow active:scale-95 transition flex items-center justify-center"
          aria-label="Tomar foto"
          title="Tomar foto"
        >
          <FaCamera className="text-3xl" />
        </button>
      ) : (
        <button
          onClick={handleCapture}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-3"
          aria-label="Tomar foto"
          title="Tomar foto"
        >
          <FaCamera />
          Tomar Foto
        </button>
      )}

      {/* Alternar orientación */}
      {!isMobile && (
        <button
          onClick={toggleOrientation}
          className="flex justify-center items-center w-24 h-24 rounded-full border shadow active:scale-95 transition"
          aria-label="Alternar orientación"
          title="Alternar orientación Horizontal/Vertical"
        >
          <FaCameraRotate className="w-18 h-18" />
        </button>
      )}
    </div>
  );
};

export default Controls;