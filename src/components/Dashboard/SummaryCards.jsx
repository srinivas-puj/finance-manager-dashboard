import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/helpers';
import './SummaryCards.css';

const SummaryCards = () => {
  const { financialSummary } = useFinance();
  const { balance, totalIncome, totalExpenses } = financialSummary;

  const cards = [
    {
      id: 'balance',
      label: 'Total Balance',
      value: balance,
      icon: '💰',
      colorClass: 'balance'
    },
    {
      id: 'income',
      label: 'Total Income',
      value: totalIncome,
      icon: '📈',
      colorClass: 'income'
    },
    {
      id: 'expenses',
      label: 'Total Expenses',
      value: totalExpenses,
      icon: '📉',
      colorClass: 'expenses'
    }
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.id} className={`summary-card summary-card--${card.colorClass}`}>
          <div className="summary-card__icon">{card.icon}</div>
          <div className="summary-card__content">
            <span className="summary-card__label">{card.label}</span>
            <span className="summary-card__value">{formatCurrency(card.value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
