import React from "react";
import { useCameraContext } from "../context/CameraContext";
const defaultFrameSrc = "/assets/default.png";

const CameraView = () => {
  const { videoRef, frameFile, cameraError } = useCameraContext();
  const frameSrc = frameFile ? URL.createObjectURL(frameFile) : null;

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

      {frameSrc ? (
        <img
          src={frameSrc}
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none -rotate-90 md:rotate-0"
          alt="Marco Default"
        />
      ) : (
        <img
          src={defaultFrameSrc}
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none -rotate-90 md:rotate-0"
          alt="Marco Superpuesto"
        />
      )}

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-black bg-opacity-70">
          <p>{cameraError}</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;
