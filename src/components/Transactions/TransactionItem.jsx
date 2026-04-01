import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './TransactionItem.css';

const categoryIcons = {
  'Food & Dining': '🍽️',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Bills & Utilities': '📱',
  'Healthcare': '🏥',
  'Travel': '✈️',
  'Education': '📚',
  'Salary': '💼',
  'Freelance': '💻',
  'Investments': '📊',
  'Other': '📌'
};

const TransactionItem = ({ transaction, onEdit }) => {
  const { isAdmin, dispatch } = useFinance();
  const { id, date, description, amount, category, type } = transaction;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  return (
    <div className={`transaction-item transaction-item--${type}`}>
      <div className="transaction-item__icon">
        {categoryIcons[category] || '📌'}
      </div>
      
      <div className="transaction-item__details">
        <span className="transaction-item__description">{description}</span>
        <span className="transaction-item__meta">
          {category} • {formatDate(date)}
        </span>
      </div>
      
      <div className="transaction-item__amount">
        <span className={`amount amount--${type}`}>
          {type === 'expense' ? '-' : '+'}{formatCurrency(amount)}
        </span>
        <span className={`transaction-badge transaction-badge--${type}`}>
          {type}
        </span>
      </div>

      {isAdmin && (
        <div className="transaction-item__actions">
          <button 
            className="action-btn action-btn--edit"
            onClick={onEdit}
            title="Edit"
          >
            ✏️
          </button>
          <button 
            className="action-btn action-btn--delete"
            onClick={handleDelete}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;
