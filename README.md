# Parks CRUD Frontend

This is the dedicated React frontend application for the **Parks Management System** used by the Metropolitan Agency of Urban Forests (**AMBU - Agencia Metropolitana de Bosques Urbanos**). 

This repository operates as a decoupled single-page application (SPA) that consumes urban forest data from a remote backend API while intelligently mapping and rendering assets from the network storage environment.

---

## 🚀 Technology Stack

* **Frontend Framework:** React 18 (JavaScript)
* **Build Tool & Dev Server:** Vite
* **HTTP Client:** Axios (configured with custom API security headers)
* **Styling:** Tailwind CSS (Modern, component-based layout)

---

## ✨ Key Features

* **Remote Data Synchronization:** Connects seamlessly to a remote Laravel API backend to fetch, create, edit, and toggle active states of park records.
* **Smart Storage Fallback:** Decoupled image rendering system that automatically maps asset streams using sequential network paths (`/storage/parks/quadrants/` or `/storage/parks/`) hosted on the development network (`192.168.0.189:8000`).
* **Infinite Loop Protection:** Core visual components implement a robust `onError` event handler fallback mechanism to ensure broken asset URLs gracefully render vector icons without jamming the client's network tab.
* **Scannable Operator Dashboard:** Clean, responsive UI with inline CRUD interactions (View, Edit, Delete) optimized for quick data management.

---

## ⚙️ API & Service Configuration (`src/services/api.js`)

The communication layer handles public/private key authentication signatures and targets the synchronized development server for data and assets:

```javascript
// Base endpoint for text/JSON operations
export const BASE_URL = '[http://192.168.0.189:8000/api/web/v1/parks](http://192.168.0.189:8000/api/web/v1/parks)';

// Fallback routing for physical images
export const STORAGE_URL = '[http://192.168.0.189:8000/storage/parks](http://192.168.0.189:8000/storage/parks)';

🛠️ Manual Local Setup & Execution
Follow these steps to spin up this frontend service on your machine:

1. Clone the Repository and Navigate to the Directory

git clone [https://github.com/2124300390-stack/parks-crud-front.git](https://github.com/2124300390-stack/parks-crud-front.git)
cd parks-crud-front

2. Install Node Dependencies

npm install

3. Ensure the Storage Server Host is Active
For the system to render the high-resolution park graphics, ensure the backend storage symlink is running with network exposure. In the local Laravel project terminal, run:

php artisan serve --host=0.0.0.0 --port=8000

🗂️ Asset Location Note: The dynamic card component targets park.park_img_uri to extract the file name string and maps it against the network directory under: ...\storage\app\public\parks\quadrants\

4. Run the Frontend Development Server
Fire up the Vite server:

npm run dev

Open your browser and navigate to http://localhost:5173 to access the functional control dashboard.

📂 Project Structure

parks-crud-front/
├── public/              # Static frontend assets
├── src/
│   ├── components/      
│   │   ├── parkCard.jsx # Card renderer with asset fallback logic
│   │   ├── parkForm.jsx # Unified form for creation and editing modes
│   │   └── parkModal.jsx# Detailed information display modal
│   ├── pages/
│   │   └── Home.jsx      # Main operational view and dashboard state
│   ├── services/        
│   │   └── api.js       # Axios client with AMBU security keys
│   ├── App.jsx          # Structural wrapper
│   └── main.jsx         # Application mounting entrypoint
├── package.json         # Project manifests and scripts
└── vite.config.js       # Vite bundler configurations


🔄 Development & Contribution Workflow
Code & Commit Conventions
Assets: When updating image references via the edit modal, always insert the clean file name signature (e.g., BLC-20250103-142552.jpg) instead of complete Windows file paths.

Commits: Use structural semantic commit formatting to maintain logical change histories:

feat: manage local image fallback routes on card error
^---^  ^--------------------------------------------^
|       |
|       +-> Summary in present tense.
|
+--------> Type: feat, fix, docs, chore, refactor, style