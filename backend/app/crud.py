from sqlalchemy.orm import Session
from . import models, schemas

# Projects
def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_project_by_number(db: Session, project_number: str):
    return db.query(models.Project).filter(models.Project.project_number == project_number).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate):
    db_project = get_project(db, project_id)
    if db_project:
        update_data = project_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = get_project(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False

# Areas
def get_areas_by_project(db: Session, project_id: int):
    return db.query(models.Area).filter(models.Area.project_id == project_id).all()

def create_area(db: Session, area: schemas.AreaCreate):
    db_area = models.Area(**area.model_dump())
    db.add(db_area)
    db.commit()
    db.refresh(db_area)
    return db_area

# Items
def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# Vendors
def get_vendors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vendor).offset(skip).limit(limit).all()

def create_vendor(db: Session, vendor: schemas.VendorCreate):
    db_vendor = models.Vendor(**vendor.model_dump())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

# Vendor Offers
def get_vendor_offers_by_item(db: Session, item_id: int):
    return db.query(models.VendorItemOffer).filter(models.VendorItemOffer.item_id == item_id).all()

def create_vendor_offer(db: Session, offer: schemas.VendorItemOfferCreate):
    db_offer = models.VendorItemOffer(**offer.model_dump())
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer

# Project BOM
def get_project_items(db: Session, project_id: int):
    return db.query(models.ProjectItem).filter(models.ProjectItem.project_id == project_id).all()

def create_project_item(db: Session, project_item: schemas.ProjectItemCreate):
    db_item = models.ProjectItem(**project_item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# Reports
def get_project_summary(db: Session, project_id: int):
    items = get_project_items(db, project_id)
    total_estimated_cost = sum(i.estimated_unit_cost * i.quantity for i in items if i.estimated_unit_cost)
    total_actual_cost = sum(i.actual_unit_cost * i.quantity for i in items if i.actual_unit_cost)
    total_sell = sum(i.estimated_sell_price * i.quantity for i in items if i.estimated_sell_price)
    profit = total_sell - total_actual_cost
    margin = (profit / total_sell * 100) if total_sell > 0 else 0
    
    return {
        "total_estimated_cost": total_estimated_cost,
        "total_actual_cost": total_actual_cost,
        "total_sell": total_sell,
        "profit": profit,
        "margin_percent": margin
    }
