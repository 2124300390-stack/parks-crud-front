import { useState, useEffect } from 'react';
import { getParks, createPark, updatePark, deletePark } from '../services/api';
import ParkCard from '../components/parkCard';
import ParkForm from '../components/parkForm';
import ParkModal from '../components/parkModal';

function Home() {
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null); 
  const [editingPark, setEditingPark] = useState(null); 
  const [showForm, setShowForm] = useState(false);

  // Cargar el listado inicial desde el servidor
  const loadParks = async () => {
    try {
      const response = await getParks();
      // Axios encapsula el JSON del servidor en la propiedad .data
      if (response && response.data) {
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setParks(dataArray);
      }
    } catch (error) {
      console.error("Error al cargar los parques desde Laravel:", error);
    }
  };

  useEffect(() => {
    loadParks();
  }, []);

  // Manejar creación y edición masiva
  const handleFormSubmit = async (formData) => {
    try {
      if (editingPark) {
        await updatePark(editingPark.id, formData);
        alert('🎉 ¡Parque actualizado con éxito en el servidor!');
      } else {
        await createPark(formData);
        alert('🚀 ¡Parque creado de forma exitosa en el backend!');
      }
      setEditingPark(null);
      setShowForm(false);
      loadParks(); // Refrescar interfaz con los datos frescos del servidor
    } catch (error) {
      console.error("Error en la operación del CRUD:", error);
      const errorMsg = error.response?.data?.message || error.message;
      alert(`⚠️ Falló el guardado: ${errorMsg}`);
    }
  };

  // Manejar la baja lógica del parque (PATCH /toggle-active)
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas desactivar este parque de la base de datos? (Se aplicará una baja lógica).")) {
      try {
        await deletePark(id);
        alert('📉 Parque actualizado/desactivado con éxito.');
        loadParks();
      } catch (error) {
        console.error("Error al ejecutar toggle-active:", error);
        alert('⚠️ Hubo un error al intentar cambiar el estado del parque.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Navbar Minimalista */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏞️</span>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Natura<span className="text-emerald-600">Hub</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setEditingPark(null); setShowForm(!showForm); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm ${
                showForm || editingPark 
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {showForm || editingPark ? '✕ Cancelar' : '＋ Nuevo Parque'}
            </button>
          </div>
        </div>
      </nav>

      {/* Contenedor Principal */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Renderizado Dinámico del Formulario */}
        {(showForm || editingPark) && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xl mb-10 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              {editingPark ? '📝 Modificar Datos del Parque' : '✨ Registrar Nuevo Parque'}
            </h3>
            <ParkForm 
              onSubmit={handleFormSubmit} 
              initialData={editingPark} 
              onCancel={() => { setEditingPark(null); setShowForm(false); }}
            />
          </div>
        )}

        {/* Encabezado del Listado */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Listado de Parques (Conectado a API Laravel)</h3>
          <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-extrabold shadow-sm">
            {parks.length} {parks.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {/* Grid Inmobiliario de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {parks.map((park) => (
            <ParkCard
              key={park.id}
              park={park}
              onViewDetail={(p) => setSelectedPark(p)}
              onEdit={(p) => { setEditingPark(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Captura de Estado Vacío o Falla de Red */}
        {parks.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center max-w-md mx-auto mt-12 shadow-sm">
            <p className="text-4xl mb-4">🍃</p>
            <h4 className="text-base font-bold text-slate-800 mb-1">No hay parques sincronizados</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Verifica que la IP pública sea correcta o presiona "Nuevo Parque" para alimentar el sistema central.</p>
          </div>
        )}
      </main>

      {/* Modal de Detalle */}
      {selectedPark && (
        <ParkModal park={selectedPark} onClose={() => setSelectedPark(null)} />
      )}
    </div>
  );
}

export default Home;