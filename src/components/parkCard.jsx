function ParkCard({ park, onViewDetail, onEdit, onDelete }) {
  // Imagen por internet de respaldo en caso de que el parque no tenga foto registrada o falle al cargar
  const defaultImage = "https://images.unsplash.com/photo-1500627869374-13cd993b1115?w=600";
  
  /**
   * REQUERIMIENTO OBLIGATORIO: Simulación de acceso a la ruta base de destino /storage/parks/
   * Concatenamos el nombre del archivo almacenado en la propiedad 'park.image'.
   * Al usar una ruta relativa inicial '/', el navegador buscará la foto directamente en la
   * carpeta local 'public/storage/parks/' del servidor frontend.
   */
  const imageUrl = park.image 
    ? `/storage/parks/${park.image}`
    : defaultImage;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-left">
      
      {/* Sección Visual de la Tarjeta */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={park.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          // El evento onError captura fallas de red y reemplaza de inmediato la imagen rota por la default
          onError={(e) => { e.target.src = defaultImage; }} 
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold rounded-lg shadow-sm">
          📍 {park.location}
        </span>
      </div>

      {/* Contenido de Texto e Información */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
            {park.name}
          </h4>
          {/* line-clamp-2 limita el texto a dos renglones máximos para mantener la simetría visual */}
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {park.description || "Sin descripción disponible para este espacio natural."}
          </p>
        </div>

        {/* Panel de Botones Operacionales del CRUD */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-auto">
          {/* Dispara la visualización del Modal de detalle */}
          <button 
            onClick={() => onViewDetail(park)} 
            className="px-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            👁️ Ver
          </button>
          {/* Envía los datos de la tarjeta hacia el formulario para editarlos */}
          <button 
            onClick={() => onEdit(park)} 
            className="px-2 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            📝 Editar
          </button>
          {/* Ejecuta la acción de borrado directo usando el ID */}
          <button 
            onClick={() => onDelete(park.id)} 
            className="px-2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            🗑️ Borrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParkCard;