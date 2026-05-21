# NaturaHub - Administración de Parques Nacionales 🌲

NaturaHub es una interfaz de usuario web moderna y minimalista desarrollada para la gestión y administración de parques naturales y ecosistemas protegidos. La aplicación permite realizar todas las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) interactuando con una API RESTful.

## 🛠️ Tecnologías Utilizadas

* **Framework:** React (Vite)
* **Estilos:** Tailwind CSS v4 (Diseño responsivo y claro)
* **Cliente HTTP:** Axios (Para consumo de API RESTful)
* **Base de Datos Simulada:** JSON-Server

## 🚀 Instrucciones de Instalación y Ejecución

Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio e instalar dependencias
Abre tu terminal en la carpeta del proyecto y ejecuta:
```bash
npm install

2. Iniciar la Base de Datos Simulada (Backend)
Para simular los endpoints de la API y poder guardar tus datos, ejecuta el servidor simulado en el puerto 5001:

Bash
npx json-server --watch db.json --port 5001


3. Iniciar el Servidor de Desarrollo (Frontend)
En una segunda pestaña de tu terminal, inicia la aplicación de React con Vite:

Bash
npm run dev

Luego, abre tu navegador en la ruta indicada en la terminal (usualmente es http://localhost:5173).