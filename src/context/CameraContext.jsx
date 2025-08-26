import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const CameraContext = createContext(null);

export const CameraProvider = ({ children }) => {
  const [frameFile, setFrameFile] = useState(null);
  const [frameName, setFrameName] = useState('Ningún archivo seleccionado.');
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameImageRef = useRef(new Image());

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara: ", err);
      setCameraError('No se pudo acceder a la cámara. Por favor, asegúrate de haber concedido los permisos.');
    }
  }, []);

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const handleFrameChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      setFrameFile(file);
      setFrameName(file.name);
      setCapturedImage(null);
      const reader = new FileReader();
      reader.onload = (e) => (frameImageRef.current.src = e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFrameFile(null);
      setFrameName('Por favor, selecciona un archivo PNG válido.');
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !frameFile) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    context.drawImage(frameImageRef.current, 0, 0, videoWidth, videoHeight);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
  };

  const value = {
    videoRef,
    canvasRef,
    frameFile,
    frameName,
    capturedImage,
    cameraError,
    handleFrameChange,
    handleCapture,
  };

  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>;
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext debe ser usado dentro de un CameraProvider');
  }
  return context;
};