import React from "react";
import { useCameraContext } from "../context/CameraContext";

// La ruta al marco por defecto en la carpeta 'public'
const defaultFrameSrc = "/assets/default.png";

const CameraView = () => {
  const { videoRef, frameFile, cameraError } = useCameraContext();

  // Se determina si 'frameFile' es un archivo subido por el usuario.
  // Solo se usará 'createObjectURL' si es un archivo válido.
  const isUserFile = frameFile && !frameFile.isDefault;
  const frameSrc = isUserFile ? URL.createObjectURL(frameFile) : defaultFrameSrc;

  return (
    <div
      id="camera-container"
      className="relative bg-black flex items-center justify-center"
    >
      <video
        id="camera-feed"
        ref={videoRef}
        playsInline
        autoPlay
        className="w-2/3 md:w-full h-full object-cover"
      ></video>

      <img
        src={frameSrc}
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none -rotate-90 md:rotate-0"
        alt={isUserFile ? "Marco Superpuesto" : "Marco por Defecto"}
      />

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-black bg-opacity-70">
          <p>{cameraError}</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;