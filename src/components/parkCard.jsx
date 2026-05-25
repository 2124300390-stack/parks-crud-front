import { useState } from 'react';

/**
 * Componente ParkCard.
 * Renderiza la tarjeta de presentación individual para cada parque.
 * Implementa una estrategia de carga de imágenes en cascada (fallback automatizado)
 * y provee los disparadores para ver detalles, editar o eliminar lógicamente el recurso.
 */
function ParkCard({ park, onViewDetail, onEdit, onDelete }) {
  
  // 🖼️ Marcador de posición (Placeholder) seguro en SVG/Base64 para usar si todas las rutas de imagen fallan
  const fallbackPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23e2e8f0'/><text x='50%' y='55%' font-size='24' text-anchor='middle'>🏞️</text></svg>";
  
  // Extrae de forma limpia únicamente el nombre del archivo binario cortando la ruta absoluta recibida
  let fileName = park.park_img_uri ? park.park_img_uri.split('/').pop().trim() : '';
  console.log('FileName: ' + fileName);

  // ==========================================
  // ESTRATEGIA EN CASCADA PARA IMÁGENES
  // ==========================================
  // Lista indexada de intentos locales y de servidor para mitigar discrepancias de rutas en el Backend
  const rutasAProbar = [];

  if (fileName && fileName !== "") {
    // Intento 1: Buscar en la subcarpeta específica de cuadrantes dentro del storage de Laravel
    rutasAProbar.push(`http://192.168.0.189:8000/storage/parks/quadrants/${fileName}`);
    
    // Intento 2: Buscar directamente en la raíz pública del almacenamiento de parques
    rutasAProbar.push(`http://192.168.0.189:8000/storage/parks/${fileName}`);
  }
  
  // Intento Final: Si la API no tiene imagen o los servidores caen, se inyecta el placeholder SVG
  rutasAProbar.push(fallbackPlaceholder);

  // Estado que rastrea cuál de las rutas de la cascada se está intentando renderizar actualmente
  const [currentTryIndex, setCurrentTryIndex] = useState(0);

  /**
   * Manejador de eventos activado cuando el tag <img> falla al cargar una ruta (Error 404/500).
   * Incrementa el índice para forzar un re-renderizado con el siguiente destino alternativo.
   */
  const handleImageError = () => {
    if (currentTryIndex < rutasAProbar.length - 1) {
      setCurrentTryIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-left">
      
      {/* ==========================================
          SECCIÓN VISUAL (IMAGEN + METADATO FLOTANTE)
          ========================================== */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
        <img 
          src={rutasAProbar[currentTryIndex]} 
          alt={park.park_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy" // Optimiza el rendimiento del navegador cargando la imagen solo al acercarse al viewport
          onError={handleImageError}
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold rounded-lg shadow-sm">
          📍 {park.park_city}
        </span>
      </div>

      {/* ==========================================
          CONTENIDO INFORMATIVO DEL PARQUE
          ========================================== */}
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

        {/* ==========================================
            PANEL OPERACIONAL DEL CRUD (BOTONES DE ACCIÓN)
            ========================================== */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-auto">
          {/* Acción: Desplegar modal detallado */}
          <button 
            onClick={() => onViewDetail(park)} 
            className="px-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            👁️ Ver
          </button>
          
          {/* Acción: Transferir objeto al estado de edición y scroll hacia arriba */}
          <button 
            onClick={() => onEdit(park)} 
            className="px-2