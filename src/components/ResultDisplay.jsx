import { useCameraContext } from "../context/CameraContext";
import { PhotoProvider, PhotoView } from "react-photo-view";

const ResultDisplay = () => {
  const { capturedImage } = useCameraContext();

  return (
    <div className="p-6 border-t border-gray-700">
     
      <PhotoProvider>
        <PhotoView src={capturedImage}>
          <img
            src={capturedImage}
            className="rounded-lg"
            alt="Foto capturada con marco"
          />
        </PhotoView>
      </PhotoProvider>
      <a
        href={capturedImage}
        download="foto-con-marco.png"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center mt-3"
      >
        Descargar Foto
      </a>
    </div>
  );
};

export default ResultDisplay;
