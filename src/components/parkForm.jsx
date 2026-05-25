import { useState, useEffect } from 'react';

/**
 * Componente ParkForm.
 * Gestiona el estado local del formulario de captura para crear o actualizar un parque.
 * Realiza la normalización y casteo de tipos de datos, maneja la carga de archivos binarios 
 * y sincroniza los campos cuando se edita un parque preexistente a través de props.
 */
function ParkForm({ onSubmit, initialData, onCancel }) {

  // Estado estructurado para los campos de texto y selección del formulario
  const [formData, setFormData] = useState({
    park_name: '',
    park_abbreviation: '',
    park_address: '',
    park_city: 'Guadalajara', // Valor por defecto estipulado
    park_state: 'Jalisco',     // Valor por defecto estipulado
    park_latitude: '',
    park_longitude: '',
    park_zip_code: ''
  });

  // Estado especial para almacenar el archivo físico binario seleccionado desde el Explorador de Archivos
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Estado para aislar y mostrar el nombre del archivo de imagen actual (útil en modo edición)
  const [currentImageName, setCurrentImageName] = useState('');

  // ==========================================
  // DISPARADOR DE SINCRONIZACIÓN (EDICIÓN/CREACIÓN)
  // ==========================================
  useEffect(() => {
    if (initialData) {
      // 📝 MODO EDICIÓN: Extracción y limpieza del nombre del archivo original
      let fileName = '';
      if (typeof initialData.park_img_uri === 'string' && initialData.park_img_uri) {
        fileName = initialData.park_img_uri.split('/').pop().trim();
      } else if (typeof initialData.park_img_url === 'string' && initialData.park_img_url) {
        fileName = initialData.park_img_url.split('/').pop().trim();
      }

      setCurrentImageName(fileName);

      // Mutación controlada del estado local con la información del parque a editar
      setFormData({
        park_name: initialData.park_name || '',
        park_abbreviation: initialData.park_abbreviation || '',
        park_address: initialData.park_address || '',
        park_city: initialData.park_city || 'Guadalajara',
        park_state: initialData.park_state || 'Jalisco',
        park_latitude: initialData.park_latitude || '',
        park_longitude: initialData.park_longitude || '',
        // Compatibilidad por si el backend mapea el código como zip_code o postal_code
        park_zip_code: initialData.park_zip_code || initialData.park_postal_code || ''
      });
      setSelectedFile(null); // Resetea la selección temporal de archivos nuevos
    } else {
      // ✨ MODO CREACIÓN: Limpieza absoluta del estado para un formulario vacío
      setCurrentImageName('');
      setSelectedFile(null);
      setFormData({
        park_name: '',
        park_abbreviation: '',
        park_address: '',
        park_city: 'Guadalajara',
        park_state: 'Jalisco',
        park_latitude: '',
        park_longitude: '',
        park_zip_code: ''
      });
    }
  }, [initialData]);

  // ==========================================
  // MANEJADORES DE ENTRADAS (HANDLERS)
  // ==========================================

  /**
   * Actualiza dinámicamente las propiedades de texto basadas en el atributo 'name' del input.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Captura el archivo binario nativo seleccionado por el usuario.
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  /**
   * Centraliza, parsea y eleva el payload de datos purificados hacia el componente superior.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construcción del objeto de transferencia aplicando casteos estrictos para evitar Errores 500 en la BD
    const datosListos = {
      park_name: formData.park_name,
      park_abbreviation: formData.park_abbreviation,
      park_address: formData.park_address,
      park_city: formData.park_city,
      park_state: formData.park_state,
      park_latitude: Number(formData.park_latitude) || 0.0,
      park_longitude: Number(formData.park_longitude) || 0.0,
      park_zip_code: parseInt(formData.park_zip_code, 10) || 0,
      
      // Condicional de Imagen: Si hay binario nuevo se adjunta, de lo contrario se envía la cadena previa
      park_img_file: selectedFile ? selectedFile : currentImageName 
    };

    console.log('Form Payload:', datosListos);
    onSubmit(datosListos); // Eleva los datos procesados al manejador del Home.jsx
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* INPUT: NOMBRE */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Nombre del Parque *</label>
          <input
            type="text" required name="park_name"
            value={formData.park_name} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          />
        </div>

        {/* INPUT: ABREVIACIÓN */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Abreviación *</label>
          <input
            type="text" required name="park_abbreviation"
            value={formData.park_abbreviation} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          />
        </div>

        {/* INPUT: DIRECCIÓN FÍSICA */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Dirección Física *</label>
          <input
            type="text" required name="park_address"
            value={formData.park_address} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          />
        </div>

        {/* SELECT: MUNICIPIO / CIUDAD */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Municipio / Ciudad *</label>
          <select
            name="park_city" value={formData.park_city} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          >
            <option value="Guadalajara">Guadalajara</option>
            <option value="Zapopan">Zapopan</option>
            <option value="Tlaquepaque">Tlaquepaque</option>
            <option value="Tonalá">Tonalá</option>
            <option value="Tlajomulco">Tlajomulco</option>
          </select>
        </div>

        {/* INPUT: ESTADO */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Estado *</label>
          <input
            type="text" required name="park_state"
            value={formData.park_state} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          />
        </div>

        {/* INPUT: CÓDIGO POSTAL */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Código Postal *</label>
          <input
            type="number" required name="park_zip_code"
            value={formData.park_zip_code} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          />
        </div>

        {/* INPUT FILE: COMPONENTE MULTIMEDIA */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Imagen del Parque *</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {/* Muestra un sutil texto informativo sobre el recurso previo si está en edición */}
          {initialData && currentImageName && !selectedFile && (
            <p className="text-[10px] text-slate-400 mt-1 pl-1">
              Imagen actual: <span className="font-mono text-slate-600">{currentImageName}</span>
            </p>
          )}
        </div>

        {/* INPUT: LATITUD */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Latitud Decimal *</label>
          <input
            type="text" required name="park_latitude"
            value={formData.park_latitude} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          />
        </div>

        {/* INPUT: LONGITUD */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Longitud Decimal *</label>
          <input
            type="text" required name="park_longitude"
            value={formData.park_longitude} onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-emerald-500"
          />
        </div>

      </div>

      {/* SECCIÓN DE BOTONES DE ACCIÓN */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-slate-500 text-sm font-bold transition-colors hover:text-slate-700"
        >
          Descartar
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-all"
        >
          {initialData ? '💾 Guardar Cambios' : '🚀 Registrar Parque'}
        </button>
      </div>
    </form>
  );
}

export default ParkForm;