import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { categories } from '../../data/transactions';
import { generateId } from '../../utils/helpers';
import Button from '../Common/Button';
import './TransactionForm.css';

const TransactionForm = ({ transaction, onClose }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const isEditing = Boolean(transaction);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const transactionData = {
      id: isEditing ? transaction.id : generateId(),
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    };

    if (isEditing) {
      await updateTransaction(transactionData);
    } else {
      await addTransaction(transactionData);
    }

    onClose();
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Description</label>
        <input
          type="text"
          name="description"
          className={`form-input ${errors.description ? 'form-input--error' : ''}`}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
        />
        {errors.description && (
          <span className="form-error">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            type="number"
            name="amount"
            className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.amount && (
            <span className="form-error">{errors.amount}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className={`form-input ${errors.date ? 'form-input--error' : ''}`}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && (
            <span className="form-error">{errors.date}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn type-btn--expense ${formData.type === 'expense' ? 'active' : ''}`}
            onClick={() => handleChange({ target: { name: 'type', value: 'expense' }})}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-btn type-btn--income ${formData.type === 'income' ? 'active' : ''}`}
            onClick={() => handleChange({ target: { name: 'type', value: 'income' }})}
          >
            Income
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          name="category"
          className="form-input"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
