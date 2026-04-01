import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: '📊', title: 'Track Spending', description: 'Monitor your expenses across categories' },
    { icon: '💰', title: 'Manage Income', description: 'Keep track of all income sources' },
    { icon: '📈', title: 'Visualize Trends', description: 'See your financial trends at a glance' },
    { icon: '💡', title: 'Get Insights', description: 'Receive intelligent financial insights' }
  ];

  return (
    <div className={`landing-page ${isVisible ? 'landing-page--visible' : ''}`}>
      {/* Animated Background */}
      <div className="landing-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="landing-container">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-icon-large">💹</span>
              Finance Dashboard
            </h1>
            <p className="hero-subtitle">
              Take control of your finances with smart tracking and insights
            </p>
            <Button 
              variant="primary" 
              size="medium"
              onClick={onGetStarted}
              className="cta-button"
            >
              Get Started
            </Button>
          </div>

          {/* Animated Illustrations */}
          <div className="hero-illustration">
            <div className="floating-card card-1">💵</div>
            <div className="floating-card card-2">📊</div>
            <div className="floating-card card-3">💳</div>
            <div className="floating-card card-4">💰</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-features">
          <h2 className="features-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="landing-stats">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Secure</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Transactions</div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="landing-footer">
          <p>Ready to manage your finances better?</p>
          <Button 
            variant="primary" 
            onClick={onGetStarted}
            className="footer-cta-button"
          >
            Start Now
          </Button>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
