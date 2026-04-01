export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const generateId = () => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

export const groupTransactionsByMonth = (transactions) => {
  const grouped = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        month: getMonthName(date.getMonth()),
        year: date.getFullYear(),
        income: 0,
        expenses: 0,
        transactions: []
      };
    }
    
    if (transaction.type === 'income') {
      grouped[key].income += transaction.amount;
    } else {
      grouped[key].expenses += transaction.amount;
    }
    
    grouped[key].transactions.push(transaction);
  });
  
  return Object.values(grouped).sort((a, b) => {
    const dateA = new Date(`${a.year}-${a.month}-01`);
    const dateB = new Date(`${b.year}-${b.month}-01`);
    return dateB - dateA;
  });
};

export const getCategoryTotals = (transactions) => {
  const totals = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  
  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
