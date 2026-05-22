import { STORAGE_URL } from '../services/api';

const ParkModal = ({ park, onClose }) => {
  if (!park) return null;

  const defaultImage = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800';
  
  // Concatenación de la ruta base /storage para visualizar la imagen real
  const imageUrl = park.park_img_url 
    ? `${STORAGE_URL}/${park.park_img_url}`
    : defaultImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all text-left">
        
        {/* Cabecera del Modal */}
        <div className="relative h-60 bg-slate-100">
          <img src={imageUrl} alt={park.park_name} className="w-full h-full object-cover" onError={(e) => { e.target.src = defaultImage; }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white text-xs font-bold shadow-md transition-colors">✕</button>
        </div>

        {/* Ficha Descriptiva y Datos Técnicos */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-700 rounded-lg">📍 {park.park_city}, {park.park_state}</span>
            <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg">C.P. {park.park_zip_code}</span>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{park.park_name}</h3>
          <p className="text-xs text-slate-400 font-semibold mb-4">Abreviación única: <span className="text-slate-700">{park.park_abbreviation}</span></p>
          
          {/* Ficha Técnica de Geolocalización */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2 mb-6">
            <p><strong>Dirección exacta:</strong> {park.park_address}</p>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 mt-2">
              <p><strong>Latitud GPS:</strong> {park.park_latitude}</p>
              <p><strong>Longitud GPS:</strong> {park.park_longitude}</p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button onClick={onClose} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm">
              Cerrar Detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkModal;