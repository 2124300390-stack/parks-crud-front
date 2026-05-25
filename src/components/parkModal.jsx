import { useState, useEffect } from 'react';

/**
 * Componente ParkModal.
 * Despliega una ventana emergente (Modal) con la información detallada e íntegra de un parque.
 * Utiliza un fondo con desenfoque (*backdrop-blur*) y hereda la estrategia de carga
 * de imágenes en cascada para garantizar consistencia visual si un recurso expira en el servidor.
 */
function ParkModal({ park, onClose }) {
  if (!park) return null;

  const fallbackPlaceholder =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23e2e8f0'/><text x='50%' y='55%' font-size='24' text-anchor='middle'>🏞️</text></svg>";

  const imgField = park.park_img_url || park.park_img_uri || '';

  let fileName = '';
  if (imgField) {
    try {
      fileName = imgField.split('/').pop().trim();
    } catch (error) {
      fileName = '';
    }
  }

  const rutasModal = [];
  if (fileName && fileName !== '') {
    if (imgField.startsWith('http')) {
      rutasModal.push(imgField);
    }
    rutasModal.push(
      `http://192.168.0.189:8000/storage/parks/quadrants/${fileName}`
    );
    rutasModal.push(
      `http://192.168.0.189:8000/storage/parks/${fileName}`
    );
  }
  rutasModal.push(fallbackPlaceholder);

  const [currentTryIndex, setCurrentTryIndex] = useState(0);

  useEffect(() => {
    setCurrentTryIndex(0);
  }, [park]);

  const handleImageError = () => {
    if (currentTryIndex < rutasModal.length - 1) {
      setCurrentTryIndex((prev) => prev + 1);
    }
  };

  const codigoPostal = park.park_zip_code || park.park_postal_code || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full text-left relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="h-64 bg-slate-100 relative flex items-center justify-center">
          <img
            src={rutasModal[currentTryIndex]}
            alt={park.park_name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">
              📍 {park.park_city || 'Guadalajara'}, {park.park_state || 'Jalisco'}
            </span>
            {codigoPostal && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                C.P. {codigoPostal}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-1">
            {park.park_name}
          </h3>

          <p className="text-xs text-slate-400 font-medium mb-4">
            Abreviación única:{' '}
            <span className="font-bold text-slate-600">
              {park.park_abbreviation}
            </span>
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-3 text-xs text-slate-700 border border-slate-100">
            <p>
              <strong>Dirección exacta:</strong>{' '}
              {park.park_address || 'Sin dirección física asignada.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
              <p>
                <strong>Latitud GPS:</strong>{' '}
                {park.park_latitude || 'No registrada'}
              </p>
              <p>
                <strong>Longitud GPS:</strong>{' '}
                {park.park_longitude || 'No registrada'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ParkModal;