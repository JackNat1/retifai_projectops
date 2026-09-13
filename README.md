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

The frontend will be available at the URL provided in the terminal (usually `http://localhost:5173`). For local development, Vite is configured to proxy `/api` requests to the backend at `http://localhost:8000`. In production this proxying is handled by nginx instead (see [Production Deployment on a UGREEN NAS](#production-deployment-on-a-ugreen-nas-nginx-reverse-proxy)).

### 5. Start Everything (Backend & Frontend)

To start both the backend and frontend with a single command:

```bash
chmod +x ./scripts/start_all.sh
./scripts/start_all.sh
```

## Production Deployment on a UGREEN NAS (nginx reverse proxy)

In production the app is deployed on the UGREEN NAS using the NAS's existing
**nginx** as the reverse proxy (replacing any separate reverse-proxy manager).
nginx serves the pre-built React frontend as static files and reverse-proxies
API traffic to the FastAPI backend. There is no Node/Vite dev server in
production.

```
Browser ──▶ nginx (:80/:443)
              ├── /            → static SPA files (dist/)
              └── /api/*       → http://127.0.0.1:8000  (uvicorn / FastAPI)
```

The `/api/` → backend rule strips the `/api` prefix, mirroring the Vite dev
proxy, so backend routes stay at the root (e.g. `/api/projects` reaches the
backend as `/projects`).

Sample config files are provided under `deploy/`:

- `deploy/nginx/retifai-projectops.conf` — nginx site (static + reverse proxy).
- `deploy/systemd/retifai-projectops-backend.service` — uvicorn service unit.

### 1. Build the frontend

On a machine with Node installed (your dev machine or the NAS):

```bash
npm ci
npm run build
```

This produces a static bundle in `dist/`.

### 2. Lay out files on the NAS

Copy the project to the NAS (paths below match the sample configs; adjust as
needed):

```bash
# On the NAS
sudo mkdir -p /srv/retifai-projectops
# Copy the repo (backend/, scripts/, etc.) into /srv/retifai-projectops
# Copy the built frontend into /srv/retifai-projectops/dist
```

### 3. Set up and run the backend

```bash
cd /srv/retifai-projectops
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r backend/requirements.txt
```

Run the backend bound to **localhost only** (nginx is the single public entry
point):

```bash
./venv/bin/python3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

To run it as a managed service, install the provided unit and enable it:

```bash
sudo cp deploy/systemd/retifai-projectops-backend.service /etc/systemd/system/
# Edit the User/Group/WorkingDirectory (and DATABASE_URL) in the unit first.
sudo systemctl daemon-reload
sudo systemctl enable --now retifai-projectops-backend
```

For production, set `DATABASE_URL` to your PostgreSQL instance (see
[Additional Information](#additional-information)); if unset the backend falls
back to a local SQLite file.

### 4. Configure nginx

Install the provided site config into the NAS nginx configuration, editing
`server_name` and `root` to match your setup:

```bash
sudo cp deploy/nginx/retifai-projectops.conf /etc/nginx/conf.d/retifai-projectops.conf
# On distros using sites-available/sites-enabled, copy to sites-available and
# symlink it into sites-enabled instead.

sudo nginx -t          # validate configuration
sudo nginx -s reload   # or: sudo systemctl reload nginx
```

### 5. Verify

```bash
# Static frontend served by nginx
curl -I http://<nas-host>/

# API reverse-proxied to the backend (prefix stripped)
curl http://<nas-host>/api/projects
```

The frontend should load and API calls should succeed through nginx without a
running Vite dev server.

## Key Features

- **Project Management:** Track leads, design, and active installs.
- **BOM (Bill of Materials):** Manage items and vendor offers independently.
- **Area/Room Tracking:** Organize projects by physical locations.
- **Vendor Management:** Compare pricing and availability across multiple vendors.

## Additional Information

- **Logs:** Backend logs are written to `uvicorn.log`.
- **Database Configuration:** To use a different database, set the `DATABASE_URL` environment variable.
- **Specification:** Refer to `IntelliJ_IDEA_v00.1.md` for the full project specification.
