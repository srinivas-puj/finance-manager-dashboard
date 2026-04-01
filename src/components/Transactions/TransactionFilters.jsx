import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { categories } from '../../data/transactions';
import './TransactionFilters.css';

const TransactionFilters = () => {
  const { filters, dispatch } = useFinance();

  const handleFilterChange = (key, value) => {
    dispatch({ type: 'SET_FILTER', payload: { [key]: value } });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.type !== 'all' || 
    filters.searchQuery || 
    filters.dateRange !== 'all';

  return (
    <div className="transaction-filters">
      <div className="filters-row">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search transactions..."
            className="filter-search"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button className="filter-reset" onClick={handleReset}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
