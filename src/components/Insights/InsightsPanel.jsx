import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  getCategoryTotals, 
  groupTransactionsByMonth, 
  formatCurrency,
  calculatePercentageChange 
} from '../../utils/helpers';
import Card from '../Common/Card';
import './InsightsPanel.css';

const InsightsPanel = () => {
  const { transactions, financialSummary } = useFinance();

  const insights = useMemo(() => {
    const result = [];
    
    // Highest spending category
    const categoryTotals = getCategoryTotals(transactions);
    if (categoryTotals.length > 0) {
      const topCategory = categoryTotals[0];
      result.push({
        id: 'top-spending',
        title: 'Highest Spending Category',
        value: topCategory.category,
        detail: formatCurrency(topCategory.amount),
        colorClass: 'warning'
      });
    }

    // Monthly comparison
    const monthlyData = groupTransactionsByMonth(transactions);
    if (monthlyData.length >= 2) {
      const currentMonth = monthlyData[0];
      const previousMonth = monthlyData[1];
      const change = calculatePercentageChange(
        currentMonth.expenses, 
        previousMonth.expenses
      );
      
      result.push({
        id: 'monthly-change',
        title: 'Spending vs Last Month',
        value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        detail: `${formatCurrency(currentMonth.expenses)} this month`,
        colorClass: change >= 0 ? 'danger' : 'success'
      });
    }

    // Savings rate
    if (financialSummary.totalIncome > 0) {
      const savingsRate = ((financialSummary.totalIncome - financialSummary.totalExpenses) 
        / financialSummary.totalIncome) * 100;
      
      result.push({
        id: 'savings-rate',
        title: 'Savings Rate',
        value: `${savingsRate.toFixed(1)}%`,
        detail: savingsRate >= 20 ? 'Great job!' : 'Try to save more',
        colorClass: savingsRate >= 20 ? 'success' : 'warning'
      });
    }

    // Average transaction
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length > 0) {
      const avgExpense = expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length;
      result.push({
        id: 'avg-expense',
        title: 'Average Expense',
        value: formatCurrency(avgExpense),
        detail: `Based on ${expenses.length} transactions`,
        colorClass: 'neutral'
      });
    }

    // Most frequent category
    const categoryCounts = {};
    transactions.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
    const mostFrequent = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostFrequent) {
      result.push({
        id: 'frequent-category',
        title: 'Most Frequent Category',
        value: mostFrequent[0],
        detail: `${mostFrequent[1]} transactions`,
        colorClass: 'info'
      });
    }

    // Daily average spending
    if (monthlyData.length > 0 && monthlyData[0].expenses > 0) {
      const dailyAvg = monthlyData[0].expenses / 30;
      result.push({
        id: 'daily-avg',
        title: 'Daily Average Spending',
        value: formatCurrency(dailyAvg),
        detail: 'This month',
        colorClass: 'neutral'
      });
    }

    return result;
  }, [transactions, financialSummary]);

  if (insights.length === 0) {
    return (
      <Card title="Insights">
        <p className="insights-empty">Add more transactions to see insights</p>
      </Card>
    );
  }

  return (
    <Card title="Financial Insights" className="insights-card">
      <div className="insights-grid">
        {insights.map(insight => (
          <div 
            key={insight.id} 
            className={`insight-item insight-item--${insight.colorClass}`}
          >
            <span className="insight-icon">{insight.icon}</span>
            <div className="insight-content">
              <span className="insight-title">{insight.title}</span>
              <span className="insight-value">{insight.value}</span>
              <span className="insight-detail">{insight.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InsightsPanel;
