# ReTiFai ProjectOps

ReTiFai ProjectOps is a smart home and AV project management tool designed to track projects, rooms, devices, vendors, pricing, and installation status.

## Tech Stack

- **Backend:** FastAPI (Python 3.12+)
- **Database:** SQLite (default) / PostgreSQL (optional via environment variable)
- **ORM:** SQLAlchemy
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS

## Project Structure

- `backend/`: FastAPI application code.
- `src/`: React frontend source code.
- `scripts/`: Utility scripts for management and startup.
- `public/`: Static assets for the frontend.
- `retifai_projectops.db`: Local SQLite database.

## Prerequisites

- Node.js (v20.19+ or v22.12+)
- Python (v3.12+)
- `npm` (Node Package Manager)

## Setup and Startup

### 1. Backend Setup

The backend runs in a Python virtual environment.

```bash
# Create virtual environment (if not exists)
python3 -m venv venv

# Install dependencies
./venv/bin/pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary
```

### 2. Start the Backend

A helper script is provided to start the backend in the background.

```bash
chmod +x ./scripts/start_backend.sh
./scripts/start_backend.sh
```

The backend API will be available at `http://localhost:8000`. 

**Interactive API Docs:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

**Example API Usage:**
```bash
# Get all projects
curl http://localhost:8000/projects

# Create a new project
curl -X POST "http://localhost:8000/projects" \
     -H "Content-Type: application/json" \
     -d '{"project_number": "P001", "project_name": "Modern Villa", "client_name": "Jane Smith", "status": "lead"}'
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install
```

### 4. Start the Frontend

```bash
npm run dev
```

The frontend will be available at the URL provided in the terminal (usually `http://localhost:5173`). Vite is configured to proxy `/api` requests to the backend at `http://localhost:8000`.

### 5. Start Everything (Backend & Frontend)

To start both the backend and frontend with a single command:

```bash
chmod +x ./scripts/start_all.sh
./scripts/start_all.sh
```

## Key Features

- **Project Management:** Track leads, design, and active installs.
- **BOM (Bill of Materials):** Manage items and vendor offers independently.
- **Area/Room Tracking:** Organize projects by physical locations.
- **Vendor Management:** Compare pricing and availability across multiple vendors.

## Additional Information

- **Logs:** Backend logs are written to `uvicorn.log`.
- **Database Configuration:** To use a different database, set the `DATABASE_URL` environment variable.
- **Specification:** Refer to `IntelliJ_IDEA_v00.1.md` for the full project specification.
