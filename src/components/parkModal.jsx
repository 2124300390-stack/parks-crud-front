const ParkModal = ({ park, onClose }) => {
  // Cortocircuito: Si no hay ningún parque seleccionado para ver, el componente no renderiza nada en pantalla
  if (!park) return null;

  const defaultImage = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800';
  
  // REQUERIMIENTO OBLIGATORIO: Concatenación de la ruta base del servidor para renderizar la imagen local
  const imageUrl = park.image 
    ? `/storage/parks/${park.image}`
    : defaultImage;

  return (
    // Contenedor del fondo oscuro translúcido con efecto de desenfoque (backdrop-blur)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      
      {/* Cuerpo del Modal con diseño claro */}
      <div className="bg-white border border-slate-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all text-left">
        
        {/* Cabecera del Modal con Imagen */}
        <div className="relative h-60 bg-slate-100">
          <img 
            src={imageUrl} 
            alt={park.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = defaultImage; }}
          />
          {/* Botón flotante superior para cerrar */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white text-xs font-bold shadow-md transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Ficha descriptiva completa del Parque */}
        <div className="p-6 md:p-8">
          <span className="inline-block px-3 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-700 rounded-lg mb-3">
            📍 {park.location}
          </span>
          <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
            {park.name}
          </h3>
          {/* whitespace-pre-line respeta los saltos de línea que el usuario introduzca en el texto */}
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-6">
            {park.description || 'Este espacio natural no cuenta con una descripción detallada registrada todavía.'}
          </p>
          
          {/* Botón inferior de cierre */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkModal;