import { useState, useEffect } from 'react';

const ParkForm = ({ onSubmit, initialData, onCancel }) => {
  // Declaración de estados independientes para controlar los inputs de manera síncrona
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Hook useEffect: Controla si el formulario está en modo "Crear" o "Editar"
  // Si recibe 'initialData', precarga los campos con los datos del parque seleccionado
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setLocation(initialData.location || '');
      setDescription(initialData.description || '');
      setImageUrl(initialData.image || ''); // Lee la propiedad 'image' del JSON
    } else {
      // Si no hay datos iniciales, limpia todos los campos (Modo Registro)
      setName('');
      setLocation('');
      setDescription('');
      setImageUrl('');
    }
  }, [initialData]);

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue por defecto
    
    // Validación básica para asegurar que los campos obligatorios no estén vacíos
    if (!name.trim() || !location.trim()) {
      alert('El Nombre y la Ubicación son obligatorios.');
      return;
    }
    
    // REQUERIMIENTO CRUCIAL: Empaquetamos la variable local 'imageUrl' bajo la clave 'image'
    // Esto garantiza la sincronización exacta con el backend y las llaves del db.json
    onSubmit({ 
      name, 
      location, 
      description, 
      image: imageUrl 
    });
  };

  // Clases estéticas reutilizables de Tailwind CSS para mantener los inputs limpios
  const inputClasses = "w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-black text-slate-900">
        {initialData ? '📝 Modificar Datos del Parque' : '✨ Registrar Nuevo Parque'}
      </h3>

      {/* Grid responsivo para Nombre y Ubicación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre del Parque *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Parque Nacional Bosques"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ubicación *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Colomos, Guadalajara"
            className={inputClasses}
            required
          />
        </div>
      </div>

      {/* Input para el nombre del archivo físico de la imagen */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre del archivo de imagen (Opcional)</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Ej. imagen1.jpg"
          className={inputClasses}
        />
      </div>

      {/* Caja de texto para la descripción */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Descripción del Ecosistema</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe los detalles de la flora, fauna o clima del parque..."
          rows="3"
          className={`${inputClasses} resize-none`}
        ></textarea>
      </div>

      {/* Botones del Formulario */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
        >
          Descartar
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          {initialData ? '💾 Guardar Cambios' : '🚀 Registrar Parque'}
        </button>
      </div>
    </form>
  );
};

export default ParkForm;