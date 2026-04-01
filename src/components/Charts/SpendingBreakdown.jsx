import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryTotals, formatCurrency } from '../../utils/helpers';
import Card from '../Common/Card';
import './Charts.css';

const categoryColors = {
  'Food & Dining': '#ff6b6b',
  'Transportation': '#4ecdc4',
  'Shopping': '#45b7d1',
  'Entertainment': '#f9ca24',
  'Bills & Utilities': '#6c5ce7',
  'Healthcare': '#a8e6cf',
  'Travel': '#fd79a8',
  'Education': '#74b9ff',
  'Other': '#636e72'
};

const SpendingBreakdown = () => {
  const { transactions } = useFinance();

  const categoryData = useMemo(() => {
    return getCategoryTotals(transactions).slice(0, 6);
  }, [transactions]);

  const totalSpending = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.amount, 0);
  }, [categoryData]);

  if (categoryData.length === 0) {
    return (
      <Card title="Spending Breakdown">
        <div className="chart-empty">No expense data available</div>
      </Card>
    );
  }

  return (
    <Card title="Spending Breakdown" className="chart-card">
      <div className="spending-breakdown">
        <div className="donut-chart">
          <svg viewBox="0 0 100 100" className="donut-svg">
            {categoryData.reduce((acc, item, index) => {
              const percentage = (item.amount / totalSpending) * 100;
              const offset = acc.offset;
              const color = categoryColors[item.category] || '#636e72';
              
              acc.elements.push(
                <circle
                  key={item.category}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={color}
                  strokeWidth="12"
                  strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                  strokeDashoffset={-offset * 2.51}
                  className="donut-segment"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              );
              
              acc.offset += percentage;
              return acc;
            }, { elements: [], offset: 0 }).elements}
          </svg>
          <div className="donut-center">
            <span className="donut-total">{formatCurrency(totalSpending)}</span>
            <span className="donut-label">Total</span>
          </div>
        </div>

        <ul className="category-list">
          {categoryData.map(item => (
            <li key={item.category} className="category-item">
              <span 
                className="category-color"
                style={{ background: categoryColors[item.category] || '#636e72' }}
              ></span>
              <span className="category-name">{item.category}</span>
              <span className="category-amount">{formatCurrency(item.amount)}</span>
              <span className="category-percentage">
                {((item.amount / totalSpending) * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default SpendingBreakdown;
