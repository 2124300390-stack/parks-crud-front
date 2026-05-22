import { useState, useEffect } from 'react';

const ParkForm = ({ onSubmit, initialData, onCancel }) => {
  // Inicialización de estados sincronizados con las reglas de validación de Laravel
  const [parkName, setParkName] = useState('');
  const [parkAbbreviation, setParkAbbreviation] = useState('');
  const [parkImgUrl, setParkImgUrl] = useState('');
  const [parkAddress, setParkAddress] = useState('');
  const [parkCity, setParkCity] = useState('Zapopan'); 
  const [parkState, setParkState] = useState('Jalisco');
  const [parkZipCode, setParkZipCode] = useState('');
  const [parkLatitude, setParkLatitude] = useState('');
  const [parkLongitude, setParkLongitude] = useState('');

  // Efecto para alternar entre modo "Crear" y "Modificar"
  useEffect(() => {
    if (initialData) {
      setParkName(initialData.park_name || '');
      setParkAbbreviation(initialData.park_abbreviation || '');
      setParkImgUrl(initialData.park_img_url || '');
      setParkAddress(initialData.park_address || '');
      setParkCity(initialData.park_city || 'Zapopan');
      setParkState(initialData.park_state || 'Jalisco');
      setParkZipCode(initialData.park_zip_code || '');
      setParkLatitude(initialData.park_latitude || '');
      setParkLongitude(initialData.park_longitude || '');
    } else {
      setParkName('');
      setParkAbbreviation('');
      setParkImgUrl('');
      setParkAddress('');
      setParkCity('Zapopan');
      setParkState('Jalisco');
      setParkZipCode('');
      setParkLatitude('');
      setParkLongitude('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de seguridad local antes de disparar hacia la red
    if (!parkName.trim() || !parkAbbreviation.trim() || !parkImgUrl.trim() || !parkAddress.trim() || !parkZipCode || !parkLatitude || !parkLongitude) {
      alert('⚠️ Todos los campos marcados con asterisco (*) son obligatorios.');
      return;
    }

    // Convertimos los tipos de datos de forma estricta (integer y numeric) para Laravel
    onSubmit({
      park_name: parkName,
      park_abbreviation: parkAbbreviation,
      park_img_url: parkImgUrl,
      park_address: parkAddress,
      park_city: parkCity,
      park_state: parkState,
      park_zip_code: parseInt(parkZipCode, 10),
      park_latitude: parseFloat(parkLatitude),
      park_longitude: parseFloat(parkLongitude)
    });
  };

  const inputClasses = "w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      
      {/* Fila 1: Nombre y Abreviación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre del Parque *</label>
          <input type="text" value={parkName} onChange={(e) => setParkName(e.target.value)} placeholder="Ej. Bosque de los Colomos" className={inputClasses} required maxLength={100} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Abreviación *</label>
          <input type="text" value={parkAbbreviation} onChange={(e) => setParkAbbreviation(e.target.value)} placeholder="Ej. BCOL" className={inputClasses} required maxLength={10} />
        </div>
      </div>

      {/* Fila 2: Dirección y Nombre de Imagen en Storage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Dirección Física *</label>
          <input type="text" value={parkAddress} onChange={(e) => setParkAddress(e.target.value)} placeholder="Calle, número y colonia..." className={inputClasses} required maxLength={150} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre del archivo de Imagen *</label>
          <input type="text" value={parkImgUrl} onChange={(e) => setParkImgUrl(e.target.value)} placeholder="Ej: PAA-20250103-142552.jpg" className={inputClasses} required />
        </div>
      </div>

      {/* Fila 3: Municipios Restringidos, Estado y CP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Municipio / Ciudad *</label>
          <select value={parkCity} onChange={(e) => setParkCity(e.target.value)} className={inputClasses}>
            <option value="Zapopan">Zapopan</option>
            <option value="Guadalajara">Guadalajara</option>
            <option value="San Pedro Tlaquepaque">San Pedro Tlaquepaque</option>
            <option value="Tonalá">Tonalá</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Estado *</label>
          <input type="text" value={parkState} onChange={(e) => setParkState(e.target.value)} placeholder="Jalisco" className={inputClasses} required maxLength={100} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Código Postal *</label>
          <input type="number" value={parkZipCode} onChange={(e) => setParkZipCode(e.target.value)} placeholder="44660" className={inputClasses} required />
        </div>
      </div>

      {/* Fila 4: Coordenadas de Geolocalización Decimal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Latitud Decimal *</label>
          <input type="number" step="any" value={parkLatitude} onChange={(e) => setParkLatitude(e.target.value)} placeholder="Ej. 20.7061" className={inputClasses} required />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Longitud Decimal *</label>
          <input type="number" step="any" value={parkLongitude} onChange={(e) => setParkLongitude(e.target.value)} placeholder="Ej. -103.3914" className={inputClasses} required />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
          Descartar
        </button>
        <button type="submit" className="px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          {initialData ? '💾 Guardar Cambios' : '🚀 Registrar Parque'}
        </button>
      </div>
    </form>
  );
};

export default ParkForm;