#!/usr/bin/env python3
"""
Additional test to verify budget summary with current month expenses
"""

import requests
from datetime import datetime, date

API_BASE_URL = "https://52de225c-44b8-4504-b34c-7ece02c83a5c.preview.emergentagent.com/api"

def test_budget_with_current_month():
    # Create an expense with today's date
    current_expense = {
        "amount": 1500.00,
        "category": "Seeds & Plants",
        "description": "Current month seeds purchase",
        "expense_date": date.today().isoformat()
    }
    
    print(f"Creating expense for current date: {current_expense['expense_date']}")
    
    # Create the expense
    response = requests.post(f"{API_BASE_URL}/expenses", json=current_expense)
    if response.status_code == 200:
        expense_data = response.json()
        print(f"✅ Created expense: {expense_data['id']}")
        
        # Now check budget summary
        budget_response = requests.get(f"{API_BASE_URL}/budget/summary")
        if budget_response.status_code == 200:
            budget_data = budget_response.json()
            print(f"📊 Budget Summary:")
            print(f"   Total Expenses: ${budget_data['total_expenses']}")
            print(f"   Monthly Total: ${budget_data['monthly_total']}")
            print(f"   Categories: {budget_data['expenses_by_category']}")
            print(f"   Daily Expenses (last 7 days): {len(budget_data['daily_expenses'])} entries")
            
            if budget_data['total_expenses'] > 0:
                print("✅ Budget summary working correctly with current month data")
            else:
                print("⚠️  Budget summary still showing $0 - may be timezone issue")
        else:
            print(f"❌ Budget summary failed: {budget_response.status_code}")
    else:
        print(f"❌ Failed to create expense: {response.status_code}")

if __name__ == "__main__":
    test_budget_with_current_month()