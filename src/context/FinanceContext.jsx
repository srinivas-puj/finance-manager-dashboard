import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { initialTransactions } from '../data/transactions';

const FinanceContext = createContext(null);

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { category: 'all', type: 'all', searchQuery: '', dateRange: 'all' }
      };
    
    default:
      return state;
  }
};

const initialState = {
  transactions: initialTransactions,
  currentRole: 'viewer',
  filters: {
    category: 'all',
    type: 'all',
    searchQuery: '',
    dateRange: 'all'
  }
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  const filteredTransactions = useMemo(() => {
    let result = [...state.transactions];
    
    if (state.filters.category !== 'all') {
      result = result.filter(t => t.category === state.filters.category);
    }
    
    if (state.filters.type !== 'all') {
      result = result.filter(t => t.type === state.filters.type);
    }
    
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }
    
    if (state.filters.dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        week: 7,
        month: 30,
        quarter: 90
      };
      const days = ranges[state.filters.dateRange];
      const cutoff = new Date(now.setDate(now.getDate() - days));
      result = result.filter(t => new Date(t.date) >= cutoff);
    }
    
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [state.transactions, state.filters]);

  const financialSummary = useMemo(() => {
    const income = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [state.transactions]);

  const value = {
    ...state,
    filteredTransactions,
    financialSummary,
    dispatch,
    isAdmin: state.currentRole === 'admin'
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
