import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { groupTransactionsByMonth, formatCurrency } from '../../utils/helpers';
import Card from '../Common/Card';
import './Charts.css';

const BalanceTrendChart = () => {
  const { transactions } = useFinance();

  const chartData = useMemo(() => {
    const monthlyData = groupTransactionsByMonth(transactions);
    return monthlyData.slice(0, 6).reverse();
  }, [transactions]);

  const maxValue = useMemo(() => {
    const values = chartData.flatMap(d => [d.income, d.expenses]);
    return Math.max(...values, 1);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <Card title="Balance Trend">
        <div className="chart-empty">No data available</div>
      </Card>
    );
  }

  return (
    <Card title="Balance Trend" className="chart-card">
      <div className="bar-chart">
        <div className="chart-legend">
          <span className="legend-item legend-income">
            <span className="legend-dot"></span> Income
          </span>
          <span className="legend-item legend-expense">
            <span className="legend-dot"></span> Expenses
          </span>
        </div>
        
        <div className="bar-chart__container">
          {chartData.map((data, index) => (
            <div key={index} className="bar-chart__group">
              <div className="bar-chart__bars">
                <div 
                  className="bar-chart__bar bar-chart__bar--income"
                  style={{ height: `${(data.income / maxValue) * 100}%` }}
                  title={formatCurrency(data.income)}
                >
                  <span className="bar-chart__tooltip">
                    {formatCurrency(data.income)}
                  </span>
                </div>
                <div 
                  className="bar-chart__bar bar-chart__bar--expense"
                  style={{ height: `${(data.expenses / maxValue) * 100}%` }}
                  title={formatCurrency(data.expenses)}
                >
                  <span className="bar-chart__tooltip">
                    {formatCurrency(data.expenses)}
                  </span>
                </div>
              </div>
              <span className="bar-chart__label">
                {data.month.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BalanceTrendChart;
