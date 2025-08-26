import React, { useState, useRef, useEffect } from 'react';
import CameraView from './components/CameraView';
import Controls from './components/Controls';
import ResultDisplay from './components/ResultDisplay';

function App() {
  // --- STATE MANAGEMENT ---
  const [frameFile, setFrameFile] = useState(null);
  const [frameName, setFrameName] = useState('Ningún archivo seleccionado.');
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // --- REFS FOR DOM ELEMENTS ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameImageRef = useRef(new Image()); // Ref para la imagen del marco

  // --- EFFECT TO START CAMERA ---
  useEffect(() => {
    async function startCamera() {
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
    }
    startCamera();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  // --- EVENT HANDLERS ---
  const handleFrameChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      setFrameFile(file);
      setFrameName(file.name);
      setCapturedImage(null); // Ocultar resultado anterior al cambiar de marco
      
      // Precargar la imagen en el ref para usarla en el canvas
      const reader = new FileReader();
      reader.onload = (e) => {
        frameImageRef.current.src = e.target.result;
      };
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
    
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // 1. Dibuja la imagen del video en el canvas
    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    
    // 2. Dibuja la imagen del marco (desde el ref) sobre el video
    context.drawImage(frameImageRef.current, 0, 0, videoWidth, videoHeight);

    // 3. Obtiene la imagen combinada como un Data URL
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <h1 className="text-2xl font-bold text-center p-6 bg-gray-900">Cámara con Marco Personalizado</h1>
      
      <CameraView 
        videoRef={videoRef}
        frameSrc={frameFile ? URL.createObjectURL(frameFile) : null}
        error={cameraError}
      />
      
      <Controls 
        onFrameChange={handleFrameChange}
        onCapture={handleCapture}
        frameName={frameName}
        isFrameSelected={!!frameFile}
      />

      {capturedImage && <ResultDisplay imageDataUrl={capturedImage} />}

      {/* Canvas oculto para el procesamiento */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}

export default App;