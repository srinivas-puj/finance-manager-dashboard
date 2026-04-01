import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import LandingPage from './components/LandingPage/LandingPage';
import SummaryCards from './components/Dashboard/SummaryCards';
import RoleSelector from './components/Dashboard/RoleSelector';
import BalanceTrendChart from './components/Charts/BalanceTrendChart';
import SpendingBreakdown from './components/Charts/SpendingBreakdown';
import TransactionList from './components/Transactions/TransactionList';
import InsightsPanel from './components/Insights/InsightsPanel';
import './App.css';

const App = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return <LandingPage onGetStarted={() => setShowDashboard(true)} />;
  }

  return (
    <FinanceProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">💹</span>
              Finance Dashboard
            </h1>
            <div className="header-controls">
              <RoleSelector />
              <button 
                className="back-button"
                onClick={() => setShowDashboard(false)}
                title="Back to Home"
              >
                ← Home
              </button>
            </div>
          </div>
        </header>

        <main className="app-main">
          <section className="dashboard-section">
            <SummaryCards />
          </section>

          <section className="charts-section">
            <div className="charts-grid">
              <BalanceTrendChart />
              <SpendingBreakdown />
            </div>
          </section>

          <section className="content-section">
            <div className="content-grid">
              <div className="transactions-column">
                <TransactionList />
              </div>
              <div className="insights-column">
                <InsightsPanel />
              </div>
            </div>
          </section>
        </main>

        <footer className="app-footer">
          <p>Finance Dashboard © 2026</p>
        </footer>
      </div>
    </FinanceProvider>
  );
};

export default App;
