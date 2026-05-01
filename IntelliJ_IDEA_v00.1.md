ReTiFai ProjectOps — Build Specification
Overview
Local prototype for smart home / AV project management.
Purpose:
    • Track projects, rooms, devices, vendors, pricing, procurement, install status, and documents.
    • NOT ERP or accounting software.

Tech Stack
    • Backend: FastAPI
    • Database: PostgreSQL
    • ORM: SQLAlchemy + Alembic
    • Frontend: React + Vite
    • Storage: Local file system for attachments
    • Optional: Docker Compose

⚠️ IntelliJ Terminal Rules
    • Do NOT block execution with long-running commands.
    • Use background or separate terminals for:
        ◦ npm run dev
        ◦ uvicorn ...
        ◦ docker compose up
    • Use:
        ◦ docker compose up -d
    • Continue coding after service startup.
    • Auto-answer prompts where possible.

Core Data Model
Projects
Tracks each job.
Fields:
    • id
    • project_number
    • project_name
    • client_name
    • status
    • start_date
    • target_completion_date
    • notes
Statuses:
    • lead, design, proposal, approved, procurement, rough_in, trim_out, testing, complete

Project Gateways
    • id
    • project_id
    • gateway_name
    • status
    • target_date
    • completed_date
Examples:
    • Design Complete
    • Client Approved
    • Procurement Complete
    • Install Complete

Areas / Rooms
    • id
    • project_id
    • area_name
    • area_type
    • paint_color
    • trim_color
    • ceiling_color
    • flooring
    • notes
Types:
    • interior_room
    • exterior_zone
    • rack
    • closet
    • patio

Item Master (Vendor-Agnostic)
    • id
    • item_name
    • manufacturer
    • model_number
    • category
    • description
    • msrp
    • default_sell_price
    • default_unit_cost

Vendors
    • id
    • vendor_name
    • vendor_type
    • website
    • contact_name
    • notes

Vendor Item Offers
Links vendors to items.
    • id
    • item_id
    • vendor_id
    • vendor_sku
    • cost
    • msrp
    • availability_status
    • lead_time_days
    • vendor_url
Rule:
One item → many vendor offers

Project Items (BOM)
    • id
    • project_id
    • area_id
    • item_id
    • selected_vendor_offer_id
    • quantity
    • estimated_unit_cost
    • actual_unit_cost
    • estimated_sell_price
    • actual_sell_price
    • procurement_status
    • install_status
    • notes
Procurement Status:
    • planned
    • quoted
    • approved
    • ordered
    • received
    • backordered
Install Status:
    • not_ready
    • installed
    • configured
    • tested

Tasks
    • id
    • project_id
    • area_id
    • task_name
    • task_type
    • status
    • assigned_to
    • due_date
Statuses:
    • not_started
    • in_progress
    • blocked
    • complete

Attachments
Supports:
    • PDF
    • ODT
    • DOCX
    • XLSX
    • PNG/JPG
Fields:
    • id
    • file_name
    • file_path
    • file_type
    • project_id
    • area_id
    • item_id
    • vendor_id
Storage:
/srv/retifai-projectops/uploads

Key Business Rules
    1. Items are vendor-agnostic.
    2. Vendors attach to items via offers.
    3. Project items can override pricing.
    4. Estimated vs actual values must remain separate.
    5. Procurement and install status are independent.
    6. Attachments are reusable across entities.

Reports Required
Project Dashboard
    • Total estimated cost
    • Total actual cost
    • Total sell
    • Profit
    • Margin %
Procurement View
Filter:
procurement_status != 'received'
Area View
    • Devices per room
    • Status per room
Vendor Comparison
    • All vendor offers per item
    • Cost + availability

API Endpoints
/projects
/projects/{id}
/projects/{id}/areas
/projects/{id}/items
/items
/items/{id}/vendor-offers
/vendors
/attachments
/reports/project-summary/{id}

Frontend Pages
    1. Projects
    2. Project Dashboard
    3. Areas / Rooms
    4. BOM (Project Items)
    5. Procurement
    6. Tasks
    7. Item Master
    8. Vendors
    9. Reports

Build Priority
    1. Database schema
    2. Project CRUD
    3. Areas
    4. Item master
    5. Vendors
    6. Vendor offers
    7. Project BOM
    8. Procurement dashboard
    9. Attachments
    10. Tasks

Future Enhancements
    • Vendor price history tracking
    • Lead time forecasting
    • AI queries (LLM via Ollama)
    • Mobile UI
    • Integration with Home Assistant

Project Name
ReTiFai ProjectOps

