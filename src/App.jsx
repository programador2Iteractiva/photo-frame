import React from "react";
import { CameraProvider, useCameraContext } from "./context/CameraContext";
import CameraView from "./components/CameraView";
import Controls from "./components/Controls";
import ResultDisplay from "./components/ResultDisplay";
import useIsMobile from "./hooks/useIsMobile";

function App() {
  const isMobile = useIsMobile(); // 2. Llama al hook y guarda el resultado en la variable

  return (
    <CameraProvider>
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {!isMobile && (
          <h1 className="text-2xl font-bold text-center p-6 bg-gray-900">
            Cámara con Marco Personalizado
          </h1>
        )}

        <CameraView />
        <Controls />

        {/* El canvas ahora se renderiza aquí, gestionado por el contexto */}
        <ResultDisplayWrapper />
      </div>
    </CameraProvider>
  );
}

// Un pequeño componente wrapper para mantener la lógica de renderizado condicional limpia
const ResultDisplayWrapper = () => {
  const { capturedImage, canvasRef } = useCameraContext();
  return (
    <>
      {capturedImage && <ResultDisplay />}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </>
  );
};

export default App;
