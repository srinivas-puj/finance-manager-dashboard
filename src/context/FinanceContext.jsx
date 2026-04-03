import React, { createContext, useContext, useReducer, useMemo, useEffect, useCallback } from 'react';
import { initialTransactions } from '../data/transactions';
import { createTransaction, deleteTransaction as apiDeleteTransaction, fetchTransactions, updateTransaction as apiUpdateTransaction } from '../api/financeApi';

const FinanceContext = createContext(null);

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
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

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
  const apiEnabled = Boolean(apiBaseUrl && apiBaseUrl.trim());

  const normalizeTransactions = useCallback((txs) => {
    if (!Array.isArray(txs)) return [];
    return txs.map(t => ({
      ...t,
      amount: typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount,
    }));
  }, []);

  const refreshTransactions = useCallback(async () => {
    if (!apiEnabled) return;
    const data = await fetchTransactions();
    dispatch({
      type: 'SET_TRANSACTIONS',
      payload: normalizeTransactions(data),
    });
  }, [apiEnabled, normalizeTransactions]);

  useEffect(() => {
    // Load transactions from the API (if configured).
    refreshTransactions().catch((err) => {
      // Keep the app usable with the initial in-memory data.
      console.error('Failed to fetch transactions:', err);
    });
  }, [refreshTransactions]);

  const addTransaction = async (transaction) => {
    // Optimistic UI update for a snappy experience.
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    if (!apiEnabled) return;

    try {
      await createTransaction(transaction);
      await refreshTransactions();
    } catch (err) {
      console.error('Failed to add transaction:', err);
      await refreshTransactions().catch(() => {});
    }
  };

  const updateTransaction = async (transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    if (!apiEnabled) return;

    try {
      await apiUpdateTransaction(transaction.id, transaction);
      await refreshTransactions();
    } catch (err) {
      console.error('Failed to update transaction:', err);
      await refreshTransactions().catch(() => {});
    }
  };

  const deleteTransaction = async (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    if (!apiEnabled) return;

    try {
      await apiDeleteTransaction(id);
      await refreshTransactions();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      await refreshTransactions().catch(() => {});
    }
  };

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
    isAdmin: state.currentRole === 'admin',
    apiEnabled,
    refreshTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
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
