#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Patel Farming Expense Tracking System
Tests all CRUD operations, budget summary, and farming-specific functionality
"""

import requests
import json
from datetime import datetime, date, timedelta
import sys

# API Base URL from frontend environment
API_BASE_URL = "https://52de225c-44b8-4504-b34c-7ece02c83a5c.preview.emergentagent.com/api"

class PatelFarmingAPITester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.created_expense_ids = []
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def log_result(self, test_name, success, message=""):
        if success:
            self.test_results["passed"] += 1
            print(f"✅ {test_name}: PASSED {message}")
        else:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: FAILED - {message}")
    
    def test_api_root(self):
        """Test the root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "Patel Farming" in data.get("message", ""):
                    self.log_result("API Root Endpoint", True, "API is accessible")
                    return True
                else:
                    self.log_result("API Root Endpoint", False, f"Unexpected message: {data}")
            else:
                self.log_result("API Root Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("API Root Endpoint", False, f"Connection error: {str(e)}")
        return False
    
    def test_create_expense(self):
        """Test creating expenses with different farming categories"""
        farming_expenses = [
            {
                "amount": 2500.50,
                "category": "Seeds & Plants",
                "description": "Premium wheat seeds for 10 acres",
                "expense_date": "2024-12-15"
            },
            {
                "amount": 1800.75,
                "category": "Fertilizers & Pesticides",
                "description": "Organic fertilizer and pest control spray",
                "expense_date": "2024-12-14"
            },
            {
                "amount": 3200.00,
                "category": "Labor Costs",
                "description": "Seasonal workers for harvesting",
                "expense_date": "2024-12-13"
            },
            {
                "amount": 15000.00,
                "category": "Equipment & Machinery",
                "description": "New irrigation pump system",
                "expense_date": "2024-12-12"
            },
            {
                "amount": 850.25,
                "category": "Transportation",
                "description": "Fuel for tractor and transport to market",
                "expense_date": "2024-12-11"
            },
            {
                "amount": 450.00,
                "category": "Miscellaneous",
                "description": "Farm insurance premium",
                "expense_date": "2024-12-10"
            }
        ]
        
        success_count = 0
        for i, expense_data in enumerate(farming_expenses):
            try:
                response = requests.post(f"{self.base_url}/expenses", json=expense_data)
                if response.status_code == 200:
                    data = response.json()
                    if "id" in data and data["amount"] == expense_data["amount"]:
                        self.created_expense_ids.append(data["id"])
                        success_count += 1
                    else:
                        self.log_result(f"Create Expense {i+1}", False, f"Invalid response data: {data}")
                else:
                    self.log_result(f"Create Expense {i+1}", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result(f"Create Expense {i+1}", False, f"Error: {str(e)}")
        
        if success_count == len(farming_expenses):
            self.log_result("Create All Expenses", True, f"Created {success_count} farming expenses")
            return True
        else:
            self.log_result("Create All Expenses", False, f"Only {success_count}/{len(farming_expenses)} created")
            return False
    
    def test_get_all_expenses(self):
        """Test retrieving all expenses"""
        try:
            response = requests.get(f"{self.base_url}/expenses")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_result("Get All Expenses", True, f"Retrieved {len(data)} expenses")
                    return True
                else:
                    self.log_result("Get All Expenses", False, f"Expected list with expenses, got: {data}")
            else:
                self.log_result("Get All Expenses", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Get All Expenses", False, f"Error: {str(e)}")
        return False
    
    def test_get_expenses_by_category(self):
        """Test filtering expenses by farming categories"""
        categories = ["Seeds & Plants", "Labor Costs", "Equipment & Machinery"]
        
        success_count = 0
        for category in categories:
            try:
                response = requests.get(f"{self.base_url}/expenses", params={"category": category})
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        # Check if all returned expenses have the correct category
                        all_correct_category = all(expense.get("category") == category for expense in data)
                        if all_correct_category:
                            success_count += 1
                            self.log_result(f"Filter by {category}", True, f"Found {len(data)} expenses")
                        else:
                            self.log_result(f"Filter by {category}", False, "Some expenses have wrong category")
                    else:
                        self.log_result(f"Filter by {category}", False, f"Expected list, got: {type(data)}")
                else:
                    self.log_result(f"Filter by {category}", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result(f"Filter by {category}", False, f"Error: {str(e)}")
        
        if success_count == len(categories):
            self.log_result("Category Filtering", True, "All category filters work")
            return True
        else:
            self.log_result("Category Filtering", False, f"Only {success_count}/{len(categories)} filters work")
            return False
    
    def test_get_single_expense(self):
        """Test retrieving a single expense by ID"""
        if not self.created_expense_ids:
            self.log_result("Get Single Expense", False, "No expense IDs available for testing")
            return False
        
        expense_id = self.created_expense_ids[0]
        try:
            response = requests.get(f"{self.base_url}/expenses/{expense_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get("id") == expense_id:
                    self.log_result("Get Single Expense", True, f"Retrieved expense {expense_id}")
                    return True
                else:
                    self.log_result("Get Single Expense", False, f"ID mismatch: expected {expense_id}, got {data.get('id')}")
            else:
                self.log_result("Get Single Expense", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Get Single Expense", False, f"Error: {str(e)}")
        return False
    
    def test_update_expense(self):
        """Test updating an expense"""
        if not self.created_expense_ids:
            self.log_result("Update Expense", False, "No expense IDs available for testing")
            return False
        
        expense_id = self.created_expense_ids[0]
        update_data = {
            "amount": 3000.00,
            "category": "Seeds & Plants",
            "description": "Updated: Premium organic wheat seeds for 12 acres",
            "expense_date": "2024-12-16"
        }
        
        try:
            response = requests.put(f"{self.base_url}/expenses/{expense_id}", json=update_data)
            if response.status_code == 200:
                data = response.json()
                if (data.get("id") == expense_id and 
                    data.get("amount") == update_data["amount"] and
                    data.get("description") == update_data["description"]):
                    self.log_result("Update Expense", True, f"Updated expense {expense_id}")
                    return True
                else:
                    self.log_result("Update Expense", False, f"Update data mismatch: {data}")
            else:
                self.log_result("Update Expense", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Update Expense", False, f"Error: {str(e)}")
        return False
    
    def test_budget_summary(self):
        """Test the budget summary endpoint"""
        try:
            response = requests.get(f"{self.base_url}/budget/summary")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_expenses", "expenses_by_category", "daily_expenses", "monthly_total"]
                
                if all(field in data for field in required_fields):
                    # Check if we have category breakdown
                    categories = data.get("expenses_by_category", {})
                    daily_expenses = data.get("daily_expenses", [])
                    
                    if isinstance(categories, dict) and isinstance(daily_expenses, list):
                        self.log_result("Budget Summary", True, 
                                      f"Total: ${data['total_expenses']}, Categories: {len(categories)}, Daily entries: {len(daily_expenses)}")
                        return True
                    else:
                        self.log_result("Budget Summary", False, "Invalid data structure in response")
                else:
                    self.log_result("Budget Summary", False, f"Missing required fields: {required_fields}")
            else:
                self.log_result("Budget Summary", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Budget Summary", False, f"Error: {str(e)}")
        return False
    
    def test_delete_expense(self):
        """Test deleting an expense"""
        if not self.created_expense_ids:
            self.log_result("Delete Expense", False, "No expense IDs available for testing")
            return False
        
        # Use the last created expense for deletion
        expense_id = self.created_expense_ids[-1]
        
        try:
            response = requests.delete(f"{self.base_url}/expenses/{expense_id}")
            if response.status_code == 200:
                data = response.json()
                if "deleted successfully" in data.get("message", "").lower():
                    # Verify the expense is actually deleted
                    verify_response = requests.get(f"{self.base_url}/expenses/{expense_id}")
                    if verify_response.status_code == 404:
                        self.log_result("Delete Expense", True, f"Deleted expense {expense_id}")
                        self.created_expense_ids.remove(expense_id)
                        return True
                    else:
                        self.log_result("Delete Expense", False, "Expense still exists after deletion")
                else:
                    self.log_result("Delete Expense", False, f"Unexpected response: {data}")
            else:
                self.log_result("Delete Expense", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Delete Expense", False, f"Error: {str(e)}")
        return False
    
    def test_edge_cases(self):
        """Test edge cases and error handling"""
        edge_case_results = []
        
        # Test invalid expense ID
        try:
            response = requests.get(f"{self.base_url}/expenses/invalid-id-123")
            if response.status_code == 404:
                edge_case_results.append(True)
                self.log_result("Invalid Expense ID", True, "Returns 404 as expected")
            else:
                edge_case_results.append(False)
                self.log_result("Invalid Expense ID", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            edge_case_results.append(False)
            self.log_result("Invalid Expense ID", False, f"Error: {str(e)}")
        
        # Test invalid category
        try:
            response = requests.post(f"{self.base_url}/expenses", json={
                "amount": 100.0,
                "category": "Invalid Category",
                "description": "Test invalid category"
            })
            if response.status_code == 422:  # Validation error
                edge_case_results.append(True)
                self.log_result("Invalid Category", True, "Returns validation error as expected")
            else:
                edge_case_results.append(False)
                self.log_result("Invalid Category", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            edge_case_results.append(False)
            self.log_result("Invalid Category", False, f"Error: {str(e)}")
        
        # Test missing required fields
        try:
            response = requests.post(f"{self.base_url}/expenses", json={
                "description": "Missing amount and category"
            })
            if response.status_code == 422:  # Validation error
                edge_case_results.append(True)
                self.log_result("Missing Required Fields", True, "Returns validation error as expected")
            else:
                edge_case_results.append(False)
                self.log_result("Missing Required Fields", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            edge_case_results.append(False)
            self.log_result("Missing Required Fields", False, f"Error: {str(e)}")
        
        return all(edge_case_results)
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚜 Starting Patel Farming API Tests...")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("API Connectivity", self.test_api_root),
            ("Create Farming Expenses", self.test_create_expense),
            ("Get All Expenses", self.test_get_all_expenses),
            ("Category Filtering", self.test_get_expenses_by_category),
            ("Get Single Expense", self.test_get_single_expense),
            ("Update Expense", self.test_update_expense),
            ("Budget Summary", self.test_budget_summary),
            ("Delete Expense", self.test_delete_expense),
            ("Edge Cases", self.test_edge_cases)
        ]
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running {test_name}...")
            test_func()
        
        # Final summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        
        if self.test_results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed'])) * 100
        print(f"\n📊 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 EXCELLENT: Patel Farming API is working great!")
        elif success_rate >= 70:
            print("✅ GOOD: Most functionality is working, minor issues to address")
        else:
            print("⚠️  NEEDS ATTENTION: Several critical issues found")
        
        return success_rate >= 70

if __name__ == "__main__":
    tester = PatelFarmingAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)