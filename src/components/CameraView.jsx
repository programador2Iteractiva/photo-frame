import React from "react";
import { useCameraContext } from "../context/CameraContext";

const CameraView = () => {
  const { videoRef, frameSrc, cameraError, orientation, isFlashing, canvasRef } =
    useCameraContext();

  const containerAspect =
    orientation === "vertical" ? "aspect-[9/16]" : "aspect-video";

  // El video sí rota en vertical
  const videoRotationClass =
    orientation === "vertical" ? "-rotate-90 scale-[1.7777]" : "rotate-0 scale-100";

  // El marco NO rota nunca (ya viene en la orientación correcta)
  const frameRotationClass = "rotate-0 scale-100";

  return (
    <div
      id="camera-container"
      className={`relative flex items-center justify-center w-full ${containerAspect} overflow-hidden`}
    >
      <video
        id="camera-feed"
        ref={videoRef}
        playsInline
        autoPlay
        className={`w-full h-full object-cover ${videoRotationClass} transition-transform will-change-transform`}
      ></video>

      <img
        src={frameSrc}
        alt={`Marco ${orientation === "horizontal" ? "Horizontal" : "Vertical"}`}
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${frameRotationClass} transition-transform`}
      />

      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ${
          isFlashing ? "opacity-80" : "opacity-0"
        }`}
      />

      <canvas ref={canvasRef} className="hidden" />

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-black bg-opacity-70">
          <p className="text-white">{cameraError}</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;
