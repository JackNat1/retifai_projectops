from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, Float, Enum, DateTime
from sqlalchemy.orm import relationship
from .database import Base
import enum

class ProjectStatus(str, enum.Enum):
    lead = "lead"
    design = "design"
    proposal = "proposal"
    approved = "approved"
    procurement = "procurement"
    rough_in = "rough_in"
    trim_out = "trim_out"
    testing = "testing"
    complete = "complete"

class AreaType(str, enum.Enum):
    interior_room = "interior_room"
    exterior_zone = "exterior_zone"
    rack = "rack"
    closet = "closet"
    patio = "patio"

class ProcurementStatus(str, enum.Enum):
    planned = "planned"
    quoted = "quoted"
    approved = "approved"
    ordered = "ordered"
    received = "received"
    backordered = "backordered"

class InstallStatus(str, enum.Enum):
    not_ready = "not_ready"
    installed = "installed"
    configured = "configured"
    tested = "tested"

class TaskStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    blocked = "blocked"
    complete = "complete"

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_number = Column(String, unique=True, index=True)
    project_name = Column(String, index=True)
    client_name = Column(String)
    status = Column(String, default=ProjectStatus.lead)
    start_date = Column(Date)
    target_completion_date = Column(Date)
    notes = Column(Text)

    gateways = relationship("ProjectGateway", back_populates="project")
    areas = relationship("Area", back_populates="project")
    project_items = relationship("ProjectItem", back_populates="project")
    tasks = relationship("Task", back_populates="project")
    attachments = relationship("Attachment", back_populates="project")

class ProjectGateway(Base):
    __tablename__ = "project_gateways"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    gateway_name = Column(String)
    status = Column(String)
    target_date = Column(Date)
    completed_date = Column(Date)

    project = relationship("Project", back_populates="gateways")

class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    area_name = Column(String)
    area_type = Column(String)
    paint_color = Column(String)
    trim_color = Column(String)
    ceiling_color = Column(String)
    flooring = Column(String)
    notes = Column(Text)

    project = relationship("Project", back_populates="areas")
    project_items = relationship("ProjectItem", back_populates="area")
    tasks = relationship("Task", back_populates="area")
    attachments = relationship("Attachment", back_populates="area")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, index=True)
    manufacturer = Column(String)
    model_number = Column(String)
    category = Column(String)
    description = Column(Text)
    msrp = Column(Float)
    default_sell_price = Column(Float)
    default_unit_cost = Column(Float)

    vendor_offers = relationship("VendorItemOffer", back_populates="item")
    project_items = relationship("ProjectItem", back_populates="item")
    attachments = relationship("Attachment", back_populates="item")

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    vendor_name = Column(String, index=True)
    vendor_type = Column(String)
    website = Column(String)
    contact_name = Column(String)
    notes = Column(Text)

    vendor_offers = relationship("VendorItemOffer", back_populates="vendor")
    attachments = relationship("Attachment", back_populates="vendor")

class VendorItemOffer(Base):
    __tablename__ = "vendor_item_offers"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    vendor_sku = Column(String)
    cost = Column(Float)
    msrp = Column(Float)
    availability_status = Column(String)
    lead_time_days = Column(Integer)
    vendor_url = Column(String)

    item = relationship("Item", back_populates="vendor_offers")
    vendor = relationship("Vendor", back_populates="vendor_offers")
    project_items = relationship("ProjectItem", back_populates="selected_vendor_offer")

class ProjectItem(Base):
    __tablename__ = "project_items"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    area_id = Column(Integer, ForeignKey("areas.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    selected_vendor_offer_id = Column(Integer, ForeignKey("vendor_item_offers.id"), nullable=True)
    quantity = Column(Integer, default=1)
    estimated_unit_cost = Column(Float)
    actual_unit_cost = Column(Float)
    estimated_sell_price = Column(Float)
    actual_sell_price = Column(Float)
    procurement_status = Column(String, default=ProcurementStatus.planned)
    install_status = Column(String, default=InstallStatus.not_ready)
    notes = Column(Text)

    project = relationship("Project", back_populates="project_items")
    area = relationship("Area", back_populates="project_items")
    item = relationship("Item", back_populates="project_items")
    selected_vendor_offer = relationship("VendorItemOffer", back_populates="project_items")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=True)
    task_name = Column(String)
    task_type = Column(String)
    status = Column(String, default=TaskStatus.not_started)
    assigned_to = Column(String)
    due_date = Column(Date)

    project = relationship("Project", back_populates="tasks")
    area = relationship("Area", back_populates="tasks")

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)

    project = relationship("Project", back_populates="attachments")
    area = relationship("Area", back_populates="attachments")
    item = relationship("Item", back_populates="attachments")
    vendor = relationship("Vendor", back_populates="attachments")
