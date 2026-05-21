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

  const loadParks = async () => {
    try {
      const response = await getParks();
      if (response && response.data) {
        setParks(response.data);
      }
    } catch (error) {
      console.error("Error al cargar los parques", error);
    }
  };

useEffect(() => {
  loadParks();
}, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPark) {
        await updatePark(editingPark.id, formData);
        alert('¡Parque actualizado con éxito!');
      } else {
        await createPark(formData);
        alert('¡Parque creado exitosamente!');
      }
      setEditingPark(null);
      setShowForm(false);
      loadParks(); 
    } catch (error) {
      console.error("Error en la operación", error);
      alert(`⚠️ Error al guardar: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este espacio natural?")) {
      try {
        await deletePark(id);
        loadParks();
      } catch (error) {
        console.error("Error al eliminar", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Navbar Minimalista Blanco */}
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
        
        {/* Formulario Estético Blanco */}
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
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Listado de Parques Administrados</h3>
          <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-extrabold shadow-sm">
            {parks.length} {parks.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {/* Grid de Tarjetas */}
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

        {/* Estado Vacío Estilizado */}
        {parks.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center max-w-md mx-auto mt-12 shadow-sm">
            <p className="text-4xl mb-4">🍃</p>
            <h4 className="text-base font-bold text-slate-800 mb-1">No hay parques registrados</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Presiona el botón superior "Nuevo Parque" para registrar tu primer destino natural.</p>
          </div>
        )}
      </main>

      {/* Modal de Detalles */}
      {selectedPark && (
        <ParkModal park={selectedPark} onClose={() => setSelectedPark(null)} />
      )}
    </div>
  );
}

export default Home;