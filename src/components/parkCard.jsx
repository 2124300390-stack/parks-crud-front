import { useState } from 'react';

function ParkCard({ park, onViewDetail, onEdit, onDelete }) {
  // Cuadro seguro en Base64 con el emoji de paisaje nativo
  const fallbackPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23e2e8f0'/><text x='50%' y='55%' font-size='24' text-anchor='middle'>🏞️</text></svg>";
  
  // Limpiamos y extraemos puramente el nombre del archivo de imagen
  let fileName = park.park_img_uri ? park.park_img_uri.split('/').pop().trim() : '';
  console.log('FileName' + fileName);

  // LISTA DE INTENTOS LOCALES FORZADOS
  const rutasAProbar = [];

  if (fileName && fileName !== "") {
    // 1. Intentar directo en tu subcarpeta 'quadrants' que está dentro de public\parks en tu VS Code
    rutasAProbar.push(`http://192.168.0.188:8000/storage/parks/quadrants/${fileName}`);
    
    // 2. Intentar en la raíz de la carpeta public\parks
    rutasAProbar.push(`http://192.168.0.188:8000/storage/parks/${fileName}`);
  }
  
  rutasAProbar.push(fallbackPlaceholder);

  const [currentTryIndex, setCurrentTryIndex] = useState(0);

  const handleImageError = () => {
    if (currentTryIndex < rutasAProbar.length - 1) {
      setCurrentTryIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-left">
      
      {/* Sección Visual */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
        <img 
          src={rutasAProbar[currentTryIndex]} 
          alt={park.park_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold rounded-lg shadow-sm">
          📍 {park.park_city}
        </span>
      </div>

      {/* Contenido Informativo */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 mb-1 tracking-tight group-hover:text-emerald-600 transition-colors">
            {park.park_name}
          </h4>
          <p className="text-xs text-slate-400 font-medium mb-3">
            Siglas: <span className="font-bold text-slate-600">{park.park_abbreviation}</span>
          </p>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {park.park_address || "Sin dirección física asignada en el servidor."}
          </p>
        </div>

        {/* Panel Operacional del CRUD */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-auto">
          <button onClick={() => onViewDetail(park)} className="px-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors shadow-sm">
            👁️ Ver
          </button>
          <button onClick={() => onEdit(park)} className="px-2 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs rounded-xl transition-colors shadow-sm">
            📝 Editar
          </button>
          <button onClick={() => onDelete(park.id)} className="px-2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl transition-colors shadow-sm">
            🗑️ Borrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParkCard;