import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

const CameraContext = createContext(null);

// Marcos por defecto (puedes cambiar la ruta del vertical si tienes otro PNG)
const defaultFrameSrcHorizontal = "/assets/default.png";
const defaultFrameSrcVertical = "/assets/default.png";

export const CameraProvider = ({ children }) => {
  // Orientación seleccionada por el usuario (por defecto horizontal)
  const [orientation, setOrientation] = useState("horizontal"); // "horizontal" | "vertical"

  // Dos marcos: uno para horizontal y otro para vertical
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

  // Info de la cámara / captura
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Imagen del marco actual en memoria para dibujar en canvas
  const frameImageRef = useRef(new Image());

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16 / 9 }, // mantenemos 16:9, el lienzo se rota si eliges vertical
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

  // Iniciar cámara y cargar imágenes por defecto
  useEffect(() => {
    startCamera();
    frameImageRef.current.src =
      orientation === "horizontal"
        ? defaultFrameSrcHorizontal
        : defaultFrameSrcVertical;
  }, [startCamera]); // solo al montar

  // Cuando cambia la orientación o los marcos, sincronizamos la imagen del marco
  useEffect(() => {
    frameImageRef.current.src = frames[orientation].src;
  }, [orientation, frames]);

  // Cambiar marco (aplica al modo actual)
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
      // Solo aceptamos PNG para respetar transparencias
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

  // Capturar foto con orientación seleccionada + flash
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !frameImageRef.current.src)
      return;

    // Inicia flash
    setIsFlashing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const { videoWidth, videoHeight } = video;

    if (orientation === "vertical") {
      // Canvas en formato retrato
      canvas.width = videoHeight;
      canvas.height = videoWidth;

      // Dibuja video rotado 90° (igual que la vista)
      context.save();
      context.translate(canvas.width, 0);
      context.rotate(Math.PI / 2);
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      context.restore();

      // Dibuja marco rotado 90°
      context.save();
      context.translate(canvas.width, 0);
      context.rotate(Math.PI / 2);
      context.drawImage(frameImageRef.current, 0, 0, videoWidth, videoHeight);
      context.restore();
    } else {
      // Canvas en formato paisaje
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Dibuja video sin rotación
      context.drawImage(video, 0, 0, videoWidth, videoHeight);

      // Dibuja marco sin rotación
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

    // Apaga flash después de un momento
    setTimeout(() => setIsFlashing(false), 150);
  };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
    setCapturedImage(null);
  };

  // Datos expuestos al contexto
  const value = {
    // refs
    videoRef,
    canvasRef,

    // estado de cámara / captura
    capturedImage,
    cameraError,

    // marcos
    frameSrc: frames[orientation].src,
    frameName: frames[orientation].name,
    frameFile:
      frames[orientation].file || {
        isDefault: frames[orientation].isDefault,
      },

    // orientación y controles
    orientation,
    setOrientation,
    toggleOrientation,

    // UI
    isFlashing,

    // handlers
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
    throw new Error("useCameraContext debe ser usado dentro de un CameraProvider");
  }
  return context;
};
