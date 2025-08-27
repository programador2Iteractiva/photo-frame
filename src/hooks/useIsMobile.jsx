import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si la vista actual corresponde a un dispositivo móvil.
 * @param {number} breakpoint - El ancho máximo en píxeles para considerar como móvil.
 * @returns {boolean} - Devuelve 'true' si el ancho de la ventana es menor o igual al breakpoint.
 */
const useIsMobile = (breakpoint = 1024) => {
  // 1. Estado para guardar el resultado (true si es móvil, false si no)
  // Comprueba el valor inicial al cargar la página.
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    // 2. Función que se ejecuta cada vez que la ventana cambia de tamaño.
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // 3. Se añade un "oyente" al evento 'resize' de la ventana.
    window.addEventListener('resize', handleResize);

    // 4. Se retorna una función de limpieza para eliminar el "oyente" 
    // cuando el componente que usa el hook se desmonta. Esto es una buena práctica.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]); // El efecto se volverá a ejecutar solo si el breakpoint cambia.

  return isMobile;
};

export default useIsMobile;