from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, date, timedelta
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Expense Categories Enum
class ExpenseCategory(str, Enum):
    SEEDS_PLANTS = "Seeds & Plants"
    FERTILIZERS_PESTICIDES = "Fertilizers & Pesticides"
    LABOR_COSTS = "Labor Costs"
    EQUIPMENT_MACHINERY = "Equipment & Machinery"
    TRANSPORTATION = "Transportation"
    MISCELLANEOUS = "Miscellaneous"

# Define Models
class Expense(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    amount: float
    category: ExpenseCategory
    description: str
    expense_date: date = Field(default_factory=date.today)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ExpenseCreate(BaseModel):
    amount: float
    category: ExpenseCategory
    description: str
    expense_date: Optional[date] = None

class BudgetSummary(BaseModel):
    total_expenses: float
    expenses_by_category: dict
    daily_expenses: List[dict]
    monthly_total: float

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Expense Routes
@api_router.post("/expenses", response_model=Expense)
async def create_expense(expense_data: ExpenseCreate):
    expense_dict = expense_data.dict()
    if expense_dict['date'] is None:
        expense_dict['date'] = date.today()
    expense_obj = Expense(**expense_dict)
    await db.expenses.insert_one(expense_obj.dict())
    return expense_obj

@api_router.get("/expenses", response_model=List[Expense])
async def get_expenses(category: Optional[ExpenseCategory] = None, limit: int = 50):
    filter_query = {}
    if category:
        filter_query["category"] = category
    
    expenses = await db.expenses.find(filter_query).sort("timestamp", -1).limit(limit).to_list(limit)
    return [Expense(**expense) for expense in expenses]

@api_router.get("/expenses/{expense_id}", response_model=Expense)
async def get_expense(expense_id: str):
    expense = await db.expenses.find_one({"id": expense_id})
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return Expense(**expense)

@api_router.put("/expenses/{expense_id}", response_model=Expense)
async def update_expense(expense_id: str, expense_data: ExpenseCreate):
    expense_dict = expense_data.dict()
    if expense_dict['date'] is None:
        expense_dict['date'] = date.today()
    
    result = await db.expenses.update_one(
        {"id": expense_id}, 
        {"$set": expense_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    updated_expense = await db.expenses.find_one({"id": expense_id})
    return Expense(**updated_expense)

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str):
    result = await db.expenses.delete_one({"id": expense_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}

@api_router.get("/budget/summary", response_model=BudgetSummary)
async def get_budget_summary():
    # Get current month expenses
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    expenses = await db.expenses.find({
        "timestamp": {"$gte": current_month}
    }).to_list(1000)
    
    total_expenses = sum(expense["amount"] for expense in expenses)
    
    # Group by category
    expenses_by_category = {}
    for expense in expenses:
        category = expense["category"]
        if category not in expenses_by_category:
            expenses_by_category[category] = 0
        expenses_by_category[category] += expense["amount"]
    
    # Group by day for last 7 days
    daily_expenses = []
    for i in range(7):
        target_date = (datetime.now() - timedelta(days=i)).date()
        day_total = sum(
            expense["amount"] for expense in expenses 
            if expense["date"] == target_date.isoformat()
        )
        daily_expenses.append({
            "date": target_date.isoformat(),
            "total": day_total
        })
    
    return BudgetSummary(
        total_expenses=total_expenses,
        expenses_by_category=expenses_by_category,
        daily_expenses=daily_expenses,
        monthly_total=total_expenses
    )

# Original status check routes
@api_router.get("/")
async def root():
    return {"message": "Patel Farming API - Expense Tracker Ready!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()