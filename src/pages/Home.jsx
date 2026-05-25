import { useState, useEffect } from 'react';
import { getParks, createPark, updatePark, deletePark } from '../services/api';
import ParkCard from '../components/parkCard';
import ParkForm from '../components/parkForm';
import ParkModal from '../components/parkModal';

/**
 * Componente principal de la aplicación (Vista de Inicio).
 * Controla el estado global de los parques, la lógica del CRUD y
 * coordina la visualización de los subcomponentes del negocio.
 */
function Home() {
  // ==========================================
  // ESTADOS DE LA APLICACIÓN
  // ==========================================
  const [parks, setParks] = useState([]);          // Colección de parques devuelta por la API
  const [selectedPark, setSelectedPark] = useState(null); // Parque seleccionado para ver en el Modal
  const [editingPark, setEditingPark] = useState(null);   // Objeto del parque en proceso de edición
  const [showForm, setShowForm] = useState(false);       // Flag para alternar la visibilidad del formulario

  // ==========================================
  // EFECTOS / CARGA INICIAL
  // ==========================================
  
  /**
   * Consulta la API de forma asíncrona para obtener la lista de parques
   * y normaliza la estructura de la respuesta de Laravel.
   */
  const loadParks = async () => {
    try {
      const response = await getParks();

      if (response && response.data) {
        // Soporte flexible de lectura por si Laravel pagina los datos (.data.data) o envía un array plano (.data)
        const dataArray = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setParks(dataArray);
      }
    } catch (error) {
      console.error('Error al cargar parques:', error);
      alert('⚠️ No se pudieron cargar los parques.');
    }
  };

  // Dispara la petición de carga únicamente al montar el componente por primera vez
  useEffect(() => {
    loadParks();
  }, []);

  // ==========================================
  // CONTROLADORES DE ACCIONES (MANLERS)
  // ==========================================

  /**
   * Procesa la sumisión del formulario tanto para registrar nuevos parques
   * como para actualizar registros existentes.
   * @param {Object} formDataJSON - Datos nativos capturados del subcomponente Form.
   */
  const handleFormSubmit = async (formDataJSON) => {
    try {
      const imageInput = formDataJSON.park_img_file;
      const hasNewFile = imageInput instanceof File;

      // Sanitización y tipado quirúrgico de variables para cumplir el contrato de la API
      const parkData = {
        park_name: formDataJSON.park_name,
        park_abbreviation: formDataJSON.park_abbreviation,
        park_address: formDataJSON.park_address,
        park_city: formDataJSON.park_city,
        park_state: formDataJSON.park_state,
        park_zip_code: parseInt(formDataJSON.park_zip_code, 10) || 0,
        park_latitude: Number(formDataJSON.park_latitude) || 0.0,
        park_longitude: Number(formDataJSON.park_longitude) || 0.0,
      };

      // 🖼️ Gestión Condicional de Multimedia
      if (hasNewFile) {
        // Caso 1: Archivo binario directo desde el input file
        parkData.park_img_file = imageInput;
      } else {
        // Caso 2: Mantener la imagen previa o asignar una por defecto si es creación sin foto
        let currentImage = '';
        if (editingPark) {
          currentImage = editingPark.park_img_url || editingPark.park_img_uri || '';
        } else {
          currentImage = "http://192.168.0.189:8000/storage/parks/default.jpg";
        }
        parkData.park_img_url = currentImage;
      }

      // 🚦 Bifurcación de Peticiones: Actualizar o Crear
      if (editingPark) {
        await updatePark(editingPark.id, parkData);
        alert('🎉 Parque actualizado correctamente.');
      } else {
        await createPark(parkData);
        alert('🚀 Parque creado correctamente.');
      }

      // Resetear la interfaz a su estado base y refrescar la lista de la pantalla
      setEditingPark(null);
      setShowForm(false);
      loadParks();

    } catch (error) {
      console.error('Error detallado desde el servidor:', error.response?.data || error);
      const validationErrors = error.response?.data?.errors;

      // Desglose amigable de los errores de validación arrojados por el Backend
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join('\n');
        alert(`⚠️ Error de validación:\n${errorMessages}`);
      } else {
        alert(`⚠️ Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  /**
   * Alterna de forma lógica el estado activo/inactivo (Soft Delete) de un parque específico.
   * @param {string|number} id - ID del recurso a modificar.
   */
  const handleDelete = async (id) => {
    const confirmAction = window.confirm('¿Deseas cambiar el estado de este parque?');
    if (!confirmAction) return;

    try {
      await deletePark(id);
      alert('🔄 Estado del parque actualizado.');
      loadParks(); // Refrescar los cambios reflejados en la base de datos
    } catch (error) {
      console.error('Error toggle-active:', error);
      alert('⚠️ No se pudo actualizar el estado.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏞️</span>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Natura<span className="text-emerald-600">Hub</span>
            </h1>
          </div>

          {/* Botón dinámico para abrir/cerrar formulario */}
          <button
            onClick={() => {
              setEditingPark(null);
              setShowForm(!showForm);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm ${
              showForm || editingPark
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {showForm || editingPark ? '✕ Cancelar' : '＋ Nuevo Parque'}
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* RENDERIZADO CONDICIONAL: FORMULARIO DE CAPTURA */}
        {(showForm || editingPark) && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xl mb-10 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              {editingPark ? '📝 Editar Parque' : '✨ Nuevo Parque'}
            </h3>
            <ParkForm
              onSubmit={handleFormSubmit}
              initialData={editingPark}
              onCancel={() => {
                setEditingPark(null);
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* METADATOS Y CONTADOR DE REGISTROS */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Listado de Parques
          </h3>
          <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-extrabold shadow-sm">
            {parks.length} {parks.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {/* RENDERIZADO DE CONTENEDOR DE TARJETAS (RESPONSIVO) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {parks.map((park) => (
            <ParkCard
              key={park.id}
              park={park}
              onViewDetail={(p) => setSelectedPark(p)}
              onEdit={(p) => {
                setEditingPark(p);
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Lleva al usuario arriba suavemente para editar
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* CONTENEDOR DE RETROALIMENTACIÓN VACÍA */}
        {parks.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center max-w-md mx-auto mt-12 shadow-sm">
            <p className="text-4xl mb-4">🍃</p>
            <h4 className="text-base font-bold text-slate-800 mb-1">
              No hay parques registrados
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Agrega un nuevo parque para comenzar.
            </p>
          </div>
        )}
      </main>

      {/* RENDERIZADO CONDICIONAL: DETALLE EN MODAL */}
      {selectedPark && (
        <ParkModal
          park={selectedPark}
          onClose={() => setSelectedPark(null)}
        />
      )}
    </div>
  );
}

export default Home;