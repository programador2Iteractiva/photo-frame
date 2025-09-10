import React, { useEffect, useRef } from "react";
import { useCameraContext } from "../context/CameraContext";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Camera } from "@mediapipe/camera_utils";

const defaultFrameSrc = "/assets/default.png";
const defaultBgSrc = "/assets/virtual-bg.png"; // Usa tu fondo virtual aquí

const CameraView = () => {
  const { videoRef, frameFile, cameraError } = useCameraContext();
  const canvasRef = useRef(null);
  const backgroundImage = useRef(null);

  const isUserFile = frameFile && !frameFile.isDefault;
  const frameSrc = isUserFile
    ? URL.createObjectURL(frameFile)
    : defaultFrameSrc;

  useEffect(() => {
    const bg = new Image();
    bg.src = defaultBgSrc;
    backgroundImage.current = bg;

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 0,
    });

    selfieSegmentation.onResults(onResults);

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await selfieSegmentation.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    function onResults(results) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const width = results.image.width;
      const height = results.image.height;

      canvas.width = width;
      canvas.height = height;

      // Paso 1: limpiar canvas
      ctx.clearRect(0, 0, width, height);

      // Paso 2: dibujar la imagen original
      ctx.drawImage(results.image, 0, 0, width, height);

      // Paso 3: aplicar máscara para recortar el fondo
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(results.segmentationMask, 0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      // Paso 4: dibujar el fondo personalizado detrás
      if (backgroundImage.current.complete) {
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(backgroundImage.current, 0, 0, width, height);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, [videoRef]);

  return (
    <div
      id="camera-container"
      className="relative flex items-center justify-center w-full aspect-[9/16] md:aspect-video"
    >
      {/* Video oculto, solo se usa para procesar */}
      <video
        id="camera-feed"
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="hidden"
      ></video>

      {/* Canvas con el resultado procesado */}
      <canvas ref={canvasRef} className="absolute w-full h-full object-cover" />

      {/* Marco superpuesto */}
      <img
        src={frameSrc}
        alt={isUserFile ? "Marco Superpuesto" : "Marco por Defecto"}
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
