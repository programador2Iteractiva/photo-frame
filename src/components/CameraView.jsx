import React from "react";
import { useCameraContext } from "../context/CameraContext";

const CameraView = () => {
  const { videoRef, frameSrc, cameraError, orientation, isFlashing, canvasRef } =
    useCameraContext();

  // Clases dinámicas según la orientación seleccionada
  const containerAspect =
    orientation === "vertical" ? "aspect-[9/16]" : "aspect-video";

  const rotationClass =
    orientation === "vertical" ? "-rotate-90 scale-[1.7777]" : "rotate-0 scale-100";

  return (
    <div
      id="camera-container"
      className={`relative flex items-center justify-center w-full ${containerAspect}`}
    >
      {/* Video de la cámara */}
      <video
        id="camera-feed"
        ref={videoRef}
        playsInline
        autoPlay
        className={`w-full h-full object-cover ${rotationClass} transition-transform`}
      ></video>

      {/* Marco superpuesto */}
      <img
        src={frameSrc}
        alt={`Marco ${orientation === "horizontal" ? "Horizontal" : "Vertical"}`}
        className={`absolute object-contain pointer-events-none ${rotationClass} transition-transform`}
      />

      {/* Flash/Animación al capturar */}
      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ${
          isFlashing ? "opacity-80" : "opacity-0"
        }`}
      />

      {/* Canvas oculto para realizar la captura */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Error de cámara */}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-black bg-opacity-70">
          <p className="text-white">{cameraError}</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;
