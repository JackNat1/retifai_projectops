from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date
from .models import ProjectStatus, AreaType, ProcurementStatus, InstallStatus, TaskStatus

class ProjectBase(BaseModel):
    project_number: str
    project_name: str
    client_name: Optional[str] = None
    status: ProjectStatus = ProjectStatus.lead
    start_date: Optional[date] = None
    target_completion_date: Optional[date] = None
    notes: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_number: Optional[str] = None
    project_name: Optional[str] = None
    client_name: Optional[str] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[date] = None
    target_completion_date: Optional[date] = None
    notes: Optional[str] = None

class Project(ProjectBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AreaBase(BaseModel):
    area_name: str
    area_type: AreaType
    paint_color: Optional[str] = None
    trim_color: Optional[str] = None
    ceiling_color: Optional[str] = None
    flooring: Optional[str] = None
    notes: Optional[str] = None

class AreaCreate(AreaBase):
    project_id: int

class Area(AreaBase):
    id: int
    project_id: int
    model_config = ConfigDict(from_attributes=True)

class ItemBase(BaseModel):
    item_name: str
    manufacturer: Optional[str] = None
    model_number: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    msrp: Optional[float] = None
    default_sell_price: Optional[float] = None
    default_unit_cost: Optional[float] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class VendorBase(BaseModel):
    vendor_name: str
    vendor_type: Optional[str] = None
    website: Optional[str] = None
    contact_name: Optional[str] = None
    notes: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class Vendor(VendorBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class VendorItemOfferBase(BaseModel):
    item_id: int
    vendor_id: int
    vendor_sku: Optional[str] = None
    cost: Optional[float] = None
    msrp: Optional[float] = None
    availability_status: Optional[str] = None
    lead_time_days: Optional[int] = None
    vendor_url: Optional[str] = None

class VendorItemOfferCreate(VendorItemOfferBase):
    pass

class VendorItemOffer(VendorItemOfferBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ProjectItemBase(BaseModel):
    project_id: int
    area_id: int
    item_id: int
    selected_vendor_offer_id: Optional[int] = None
    quantity: int = 1
    estimated_unit_cost: Optional[float] = None
    actual_unit_cost: Optional[float] = None
    estimated_sell_price: Optional[float] = None
    actual_sell_price: Optional[float] = None
    procurement_status: ProcurementStatus = ProcurementStatus.planned
    install_status: InstallStatus = InstallStatus.not_ready
    notes: Optional[str] = None

class ProjectItemCreate(ProjectItemBase):
    pass

class ProjectItem(ProjectItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
