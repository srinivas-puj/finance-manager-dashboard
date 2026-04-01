import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import TransactionItem from './TransactionItem';
import TransactionFilters from './TransactionFilters';
import TransactionForm from './TransactionForm';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import EmptyState from '../Common/EmptyState';
import './TransactionList.css';

const TransactionList = () => {
  const { filteredTransactions, isAdmin } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddNew = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <Card 
      title="Transactions"
      action={
        isAdmin && (
          <Button onClick={handleAddNew} size="small">
            + Add Transaction
          </Button>
        )
      }
    >
      <TransactionFilters />
      
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No transactions found"
          description="Try adjusting your filters or add a new transaction"
          action={
            isAdmin && (
              <Button onClick={handleAddNew} size="small">
                Add Transaction
              </Button>
            )
          }
        />
      ) : (
        <div className="transaction-list">
          {filteredTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={() => handleEdit(transaction)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      </Modal>
    </Card>
  );
};

export default TransactionList;
