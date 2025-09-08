import React from "react";
import { useCameraContext } from "../context/CameraContext";

const defaultFrameSrc = "/assets/default.png";

const CameraView = () => {
  const { videoRef, frameFile, cameraError } = useCameraContext();

  const isUserFile = frameFile && !frameFile.isDefault;
  const frameSrc = isUserFile
    ? URL.createObjectURL(frameFile)
    : defaultFrameSrc;

  return (
    <div
      id="camera-container"
      // Aspecto vertical para móvil y horizontal para escritorio
      className="relative flex items-center justify-center w-full aspect-[9/16] md:aspect-video"
    >
      <video
        id="camera-feed"
        ref={videoRef}
        playsInline
        autoPlay
        className="w-full h-full object-cover"
      ></video>

      <img
        src={frameSrc}
        alt={isUserFile ? "Marco Superpuesto" : "Marco por Defecto"}
        // Clase para móviles: rota 90 grados y escala la imagen para que quepa en el contenedor.
        // Clase para escritorio: elimina la rotación y la escala
        className="absolute object-contain pointer-events-none -rotate-90 scale-[1.7777] md:rotate-0 md:scale-100"
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