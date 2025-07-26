import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Expense Categories
const EXPENSE_CATEGORIES = [
  "Seeds & Plants",
  "Fertilizers & Pesticides", 
  "Labor Costs",
  "Equipment & Machinery",
  "Transportation",
  "Miscellaneous"
];

const ExpenseForm = ({ onExpenseAdded, editingExpense, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Seeds & Plants',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        description: editingExpense.description,
        date: editingExpense.date
      });
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      };

      if (editingExpense) {
        await axios.put(`${API}/expenses/${editingExpense.id}`, payload);
      } else {
        await axios.post(`${API}/expenses`, payload);
      }
      
      setFormData({
        amount: '',
        category: 'Seeds & Plants',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      onExpenseAdded();
      if (editingExpense) onCancelEdit();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="expense-form-container">
      <h2 className="form-title">
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount" className="form-label">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
            required
          >
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            placeholder="Brief description of expense"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const ExpenseList = ({ expenses, onEditExpense, onDeleteExpense }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (!expenses.length) {
    return (
      <div className="empty-state">
        <p>No expenses recorded yet. Add your first expense above!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h2 className="section-title">Recent Expenses</h2>
      <div className="expense-items">
        {expenses.map(expense => (
          <div key={expense.id} className="expense-item">
            <div className="expense-header">
              <div className="expense-category">{expense.category}</div>
              <div className="expense-amount">{formatCurrency(expense.amount)}</div>
            </div>
            <div className="expense-description">{expense.description}</div>
            <div className="expense-footer">
              <div className="expense-date">{formatDate(expense.date)}</div>
              <div className="expense-actions">
                <button 
                  onClick={() => onEditExpense(expense)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteExpense(expense.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ budgetSummary, onCategoryFilter }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (!budgetSummary) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="app-title">Patel Farming</h1>
        <p className="app-subtitle">Farm Expense Management System</p>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          <h2>Track Your Farm Expenses</h2>
          <p>Manage your agricultural expenses efficiently and make informed farming decisions</p>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1529313780224-1a12b68bed16?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxmYXJtaW5nfGVufDB8fHxncmVlbnwxNzUzNTQzNzUwfDA&ixlib=rb-4.1.0&q=85"
            alt="Modern Farming"
            className="hero-img"
          />
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card total-expenses">
          <h3>Monthly Total</h3>
          <div className="summary-amount">
            {formatCurrency(budgetSummary.monthly_total)}
          </div>
        </div>

        <div className="summary-card category-breakdown">
          <h3>Expenses by Category</h3>
          <div className="category-items">
            {Object.entries(budgetSummary.expenses_by_category).map(([category, amount]) => (
              <div 
                key={category} 
                className="category-item"
                onClick={() => onCategoryFilter(category)}
              >
                <span className="category-name">{category}</span>
                <span className="category-amount">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const url = categoryFilter 
        ? `${API}/expenses?category=${encodeURIComponent(categoryFilter)}`
        : `${API}/expenses`;
      const response = await axios.get(url);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchBudgetSummary = async () => {
    try {
      const response = await axios.get(`${API}/budget/summary`);
      setBudgetSummary(response.data);
    } catch (error) {
      console.error('Error fetching budget summary:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudgetSummary();
  }, [categoryFilter]);

  const handleExpenseAdded = () => {
    fetchExpenses();
    fetchBudgetSummary();
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API}/expenses/${expenseId}`);
        fetchExpenses();
        fetchBudgetSummary();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category === categoryFilter ? '' : category);
    setActiveTab('expenses');
  };

  const clearCategoryFilter = () => {
    setCategoryFilter('');
  };

  return (
    <div className="app">
      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Expense
        </button>
        <button 
          className={`nav-tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          View Expenses
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            budgetSummary={budgetSummary}
            onCategoryFilter={handleCategoryFilter}
          />
        )}

        {activeTab === 'add' && (
          <ExpenseForm 
            onExpenseAdded={handleExpenseAdded}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
          />
        )}

        {activeTab === 'expenses' && (
          <div className="expenses-tab">
            {categoryFilter && (
              <div className="filter-info">
                <p>Showing expenses for: <strong>{categoryFilter}</strong></p>
                <button onClick={clearCategoryFilter} className="btn btn-secondary">
                  Show All Expenses
                </button>
              </div>
            )}
            <ExpenseList 
              expenses={expenses}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;