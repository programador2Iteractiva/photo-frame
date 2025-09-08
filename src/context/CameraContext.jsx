import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
const CameraContext = createContext(null);
// Se define la ruta al marco por defecto que está en la carpeta 'public'
const defaultFrameSrc = "/assets/default.png";

export const CameraProvider = ({ children }) => {
  // 1. Se inicializa 'frameFile' con un objeto para que el botón de capturar esté activo.
  const [frameFile, setFrameFile] = useState({ isDefault: true });
  const [frameName, setFrameName] = useState("Marco por defecto"); // Mensaje inicial
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const selfieSegmentationRef = useRef(null);
  const backgroundImage = useRef(new Image());
  backgroundImage.current.src = "/assets/virtual-bg.png";

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameImageRef = useRef(new Image());

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16 / 9 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara: ", err);
      setCameraError(
        "No se pudo acceder a la cámara. Por favor, asegúrate de haber concedido los permisos."
      );
    }
  }, []);

  useEffect(() => {
    startCamera();

    selfieSegmentationRef.current = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentationRef.current.setOptions({ modelSelection: 0 });

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
      setFrameName("Marco por defecto");
      if (frameImageRef.current) {
        frameImageRef.current.src = defaultFrameSrc;
      }
    }
  };

  const handleCapture = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !frameImageRef.current.src ||
      !selfieSegmentationRef.current
    )
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    // 👉 Envolver el resultado de send() en una Promesa
    const getSegmentation = () => {
      return new Promise((resolve) => {
        selfieSegmentationRef.current.onResults((results) => {
          resolve(results);
        });
        selfieSegmentationRef.current.send({ image: video });
      });
    };

    const results = await getSegmentation();

    // Paso 1: Limpiar canvas
    context.clearRect(0, 0, width, height);

    // Paso 2: Dibujar imagen original
    context.drawImage(results.image, 0, 0, width, height);

    // Paso 3: Aplicar máscara
    context.globalCompositeOperation = "destination-in";
    context.drawImage(results.segmentationMask, 0, 0, width, height);
    context.globalCompositeOperation = "source-over";

    // Paso 4: Fondo virtual
    if (backgroundImage.current.complete) {
      context.globalCompositeOperation = "destination-over";
      context.drawImage(backgroundImage.current, 0, 0, width, height);
    } else {
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
    }

    // ✅ Paso 5: Dibujar el marco (asegúrate que está cargado)
    if (frameImageRef.current.complete) {
      context.globalCompositeOperation = "source-over";
      context.drawImage(frameImageRef.current, 0, 0, width, height);
    }

    // Paso 6: Guardar imagen
    const dataUrl = canvas.toDataURL("image/png");
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

  return (
    <CameraContext.Provider value={value}>{children}</CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error(
      "useCameraContext debe ser usado dentro de un CameraProvider"
    );
  }
  return context;
};
