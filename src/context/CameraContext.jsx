import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import useIsMobile from "../hooks/useIsMobile";

const CameraContext = createContext(null);

// Cambia estas rutas a las de tus assets reales
const defaultFrameSrcHorizontal = "/assets/default.png";
const defaultFrameSrcVertical = "/assets/defaultVertical.png";

export const CameraProvider = ({ children }) => {
  const isMobile = useIsMobile();
  const [orientation, setOrientation] = useState(
    isMobile ? "vertical" : "horizontal"
  ); // "horizontal" | "vertical"

  const [frames, setFrames] = useState({
    horizontal: {
      src: defaultFrameSrcHorizontal,
      name: "Marco por defecto (Horizontal)",
      isDefault: true,
      file: null,
    },
    vertical: {
      src: defaultFrameSrcVertical,
      name: "Marco por defecto (Vertical)",
      isDefault: true,
      file: null,
    },
  });

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

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
    frameImageRef.current.src =
      orientation === "horizontal"
        ? defaultFrameSrcHorizontal
        : defaultFrameSrcVertical;
  }, [startCamera]); // al montar

  useEffect(() => {
    frameImageRef.current.src = frames[orientation].src;
  }, [orientation, frames]);

  const handleFrameChange = (event) => {
    const file = event.target.files && event.target.files[0];

    const resetToDefault = () => {
      setFrames((prev) => ({
        ...prev,
        [orientation]: {
          src:
            orientation === "horizontal"
              ? defaultFrameSrcHorizontal
              : defaultFrameSrcVertical,
          name:
            orientation === "horizontal"
              ? "Marco por defecto (Horizontal)"
              : "Marco por defecto (Vertical)",
          isDefault: true,
          file: null,
        },
      }));
      setCapturedImage(null);
      frameImageRef.current.src =
        orientation === "horizontal"
          ? defaultFrameSrcHorizontal
          : defaultFrameSrcVertical;
    };

    if (!file) {
      resetToDefault();
      return;
    }

    if (file.type !== "image/png") {
      resetToDefault();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      if (!dataUrl) return;
      setFrames((prev) => ({
        ...prev,
        [orientation]: {
          src: dataUrl,
          name: file.name,
          isDefault: false,
          file,
        },
      }));
      setCapturedImage(null);
      frameImageRef.current.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !frameImageRef.current.src)
      return;

    setIsFlashing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const { videoWidth, videoHeight } = video;

    if (orientation === "vertical") {
      // Canvas en retrato
      canvas.width = videoHeight;
      canvas.height = videoWidth;

      // 1) Dibuja el VIDEO rotado 90°
      context.save();
      context.translate(canvas.width, 0);
      context.rotate(Math.PI / 2);
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      context.restore();

      // 2) Dibuja el MARCO SIN rotación (ya viene en vertical)
      context.drawImage(frameImageRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      // Canvas en paisaje
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Video sin rotar
      context.drawImage(video, 0, 0, videoWidth, videoHeight);

      // Marco sin rotar (horizontal)
      context.drawImage(
        frameImageRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);

    setTimeout(() => setIsFlashing(false), 150);
  };

  const toggleOrientation = () => {
    // Si es móvil, no permitas cambiar la orientación.
    if (!isMobile) {
      setOrientation((prev) =>
        prev === "horizontal" ? "vertical" : "horizontal"
      );
      setCapturedImage(null);
    }
  };

  const value = {
    videoRef,
    canvasRef,
    capturedImage,
    cameraError,
    frameSrc: frames[orientation].src,
    frameName: frames[orientation].name,
    frameFile: frames[orientation].file || {
      isDefault: frames[orientation].isDefault,
    },
    orientation,
    setOrientation,
    toggleOrientation,
    isFlashing,
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