import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const CameraContext = createContext(null);
// Se define la ruta al marco por defecto que está en la carpeta 'public'
const defaultFrameSrc = "/assets/default.png"; 

export const CameraProvider = ({ children }) => {
  // 1. Se inicializa 'frameFile' con un objeto para que el botón de capturar esté activo.
  const [frameFile, setFrameFile] = useState({ isDefault: true }); 
  const [frameName, setFrameName] = useState('Marco por defecto'); // Mensaje inicial
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameImageRef = useRef(new Image());

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16 / 9 }
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
    
    // 2. Se carga la imagen del marco por defecto al iniciar
    if (frameImageRef.current) {
      frameImageRef.current.src = defaultFrameSrc;
    }

  }, [startCamera]);

  const handleFrameChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      setFrameFile(file); // Se actualiza con el archivo del usuario
      setFrameName(file.name);
      setCapturedImage(null);
      const reader = new FileReader();
      reader.onload = (e) => (frameImageRef.current.src = e.target.result);
      reader.readAsDataURL(file);
    } else {
      // Si el usuario cancela, se vuelve a cargar el marco por defecto
      setFrameFile({ isDefault: true });
      setFrameName('Marco por defecto');
      if(frameImageRef.current) {
          frameImageRef.current.src = defaultFrameSrc;
      }
    }
  };

  const handleCapture = () => {
    // 3. La condición ahora revisa si hay una imagen en 'frameImageRef'
    if (!videoRef.current || !canvasRef.current || !frameImageRef.current.src) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const { videoWidth, videoHeight } = video;
    
    const isPortrait = videoHeight > videoWidth;

    if (isPortrait) {
        canvas.width = videoHeight;
        canvas.height = videoWidth;
    } else {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
    }
    
    context.save(); 

    if (isPortrait) {
        context.translate(canvas.width, 0);
        context.rotate(Math.PI / 2);
    }

    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    
    context.restore();

    // Dibuja la imagen que esté cargada en 'frameImageRef' (la por defecto o la del usuario)
    context.drawImage(frameImageRef.current, 0, 0, canvas.width, canvas.height);

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