from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas
from .database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReTiFai ProjectOps API")

@app.get("/projects", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = crud.get_project_by_number(db, project_number=project.project_number)
    if db_project:
        raise HTTPException(status_code=400, detail="Project number already registered")
    return crud.create_project(db=db, project=project)

@app.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = crud.update_project(db, project_id=project_id, project_update=project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    success = crud.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"detail": "Project deleted"}

@app.get("/projects/{project_id}/areas", response_model=List[schemas.Area])
def read_project_areas(project_id: int, db: Session = Depends(get_db)):
    return crud.get_areas_by_project(db, project_id=project_id)

@app.post("/projects/{project_id}/areas", response_model=schemas.Area)
def create_area_for_project(project_id: int, area: schemas.AreaBase, db: Session = Depends(get_db)):
    area_create = schemas.AreaCreate(**area.model_dump(), project_id=project_id)
    return crud.create_area(db=db, area=area_create)

@app.get("/items", response_model=List[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_items(db, skip=skip, limit=limit)

@app.post("/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@app.get("/vendors", response_model=List[schemas.Vendor])
def read_vendors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_vendors(db, skip=skip, limit=limit)

@app.post("/vendors", response_model=schemas.Vendor)
def create_vendor(vendor: schemas.VendorCreate, db: Session = Depends(get_db)):
    return crud.create_vendor(db=db, vendor=vendor)

@app.get("/projects/{project_id}/items", response_model=List[schemas.ProjectItem])
def read_project_items(project_id: int, db: Session = Depends(get_db)):
    return crud.get_project_items(db, project_id=project_id)

@app.post("/projects/{project_id}/items", response_model=schemas.ProjectItem)
def create_project_item(project_id: int, project_item: schemas.ProjectItemCreate, db: Session = Depends(get_db)):
    return crud.create_project_item(db=db, project_item=project_item)

@app.get("/items/{item_id}/vendor-offers", response_model=List[schemas.VendorItemOffer])
def read_item_vendor_offers(item_id: int, db: Session = Depends(get_db)):
    return crud.get_vendor_offers_by_item(db, item_id=item_id)

@app.post("/items/{item_id}/vendor-offers", response_model=schemas.VendorItemOffer)
def create_vendor_offer(item_id: int, offer: schemas.VendorItemOfferCreate, db: Session = Depends(get_db)):
    return crud.create_vendor_offer(db=db, offer=offer)

@app.get("/reports/project-summary/{project_id}")
def read_project_summary(project_id: int, db: Session = Depends(get_db)):
    return crud.get_project_summary(db, project_id=project_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
