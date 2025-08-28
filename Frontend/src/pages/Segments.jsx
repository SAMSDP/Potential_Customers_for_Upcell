
import React, { useState } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Heart, AlertTriangle, MinusCircle, RefreshCw, Download } from "lucide-react";
import "../../assets/css/main.css";
import Card from "../components/Card";

const Segments = () => {
  // State for segment stats (stubbed for now)
  const [stats] = useState({ loyal: 0, atRisk: 0, neutral: 0, avgLTV: 0 });

  // Handler stubs
  const refreshClusters = () => {};
  const exportSegmentData = () => {};

  return (
    <div className="segments-page">
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
        <ul className="nav-menu">
          <li><a href="/" className="nav-link" data-page="dashboard"><Home size={18} />Dashboard</a></li>
          <li><a href="/analytics" className="nav-link" data-page="analytics"><BarChart3 size={18} />Analytics</a></li>
          <li><a href="/prediction" className="nav-link" data-page="prediction"><Brain size={18} />Predictions</a></li>
          <li><a href="/segments" className="nav-link active" data-page="segments"><Users size={18} />Segments</a></li>
          <li><a href="/recommendations" className="nav-link" data-page="recommendations"><Target size={18} />Recommendations</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>Customer Segments</h1>
          <p>Visualize customer clusters and behavioral patterns</p>
        </header>

        <div className="segments-dashboard">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon green"><Heart /></div>
              <div className="stat-content">
                <h3>{stats.loyal}</h3>
                <p>Loyal Customers</p>
                <span className="trend positive">High retention, premium plans</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><AlertTriangle /></div>
              <div className="stat-content">
                <h3>{stats.atRisk}</h3>
                <p>At-Risk Customers</p>
                <span className="trend negative">Require immediate attention</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><MinusCircle /></div>
              <div className="stat-content">
                <h3>{stats.neutral}</h3>
                <p>Neutral Customers</p>
                <span className="trend neutral">Standard engagement level</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><TrendingUp /></div>
              <div className="stat-content">
                <h3>${stats.avgLTV}</h3>
                <p>Avg Lifetime Value</p>
                <span className="trend positive">Across all segments</span>
              </div>
            </div>
          </div>

          <div className="visualization-section">
            <div className="chart-card" style={{gridColumn: '1 / -1'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <div>
                  <h3>Customer Segment Clusters</h3>
                  <p style={{color: 'var(--gray-600)', margin: 0}}>Usage Score vs Satisfaction Score distribution</p>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button className="btn btn-secondary" onClick={refreshClusters}><RefreshCw size={16} style={{marginRight: 4}} />Refresh</button>
                  <button className="btn btn-primary" onClick={exportSegmentData}><Download size={16} style={{marginRight: 4}} />Export</button>
                </div>
              </div>
              {/* Chart placeholder */}
              <div style={{height: 320, background: '#f9fafb', borderRadius: 8}}></div>
            </div>
          </div>

          <div className="segment-details">
            <div className="segment-cards-grid">
              {/* Loyal Customers Card */}
              <Card title={
                <div className="segment-header-flex">
                  <span className="segment-title"><Heart size={24} /> Loyal Customers</span>
                  <span className="segment-count">0 customers</span>
                </div>
              } className="segment-card loyal-card">
                <div className="segment-metrics-row">
                  <div className="metric-card">
                    <label>Avg Tenure</label>
                    <span className="metric-value">0</span>
                    <span className="metric-unit">months</span>
                  </div>
                  <div className="metric-card">
                    <label>Avg Revenue</label>
                    <span className="metric-value">$0</span>
                  </div>
                  <div className="metric-card">
                    <label>Churn Rate</label>
                    <span className="metric-value">0%</span>
                  </div>
                </div>
                <div className="segment-characteristics">
                  <h4>Key Characteristics</h4>
                  <ul>
                    <li>High tenure (24+ months)</li>
                    <li>Premium service plans</li>
                    <li>Low support ticket volume</li>
                    <li>High satisfaction scores</li>
                  </ul>
                </div>
              </Card>
              {/* At-Risk Customers Card */}
              <Card title={
                <div className="segment-header-flex">
                  <span className="segment-title"><AlertTriangle size={24} /> At-Risk Customers</span>
                  <span className="segment-count">438 customers</span>
                </div>
              } className="segment-card at-risk-card">
                <div className="segment-metrics-row">
                  <div className="metric-card">
                    <label>Avg Tenure</label>
                    <span className="metric-value">30</span>
                    <span className="metric-unit">months</span>
                  </div>
                  <div className="metric-card">
                    <label>Avg Revenue</label>
                    <span className="metric-value">$70</span>
                  </div>
                  <div className="metric-card">
                    <label>Churn Rate</label>
                    <span className="metric-value">61.2%</span>
                  </div>
                </div>
                <div className="segment-characteristics">
                  <h4>Risk Factors</h4>
                  <ul>
                    <li>Short tenure (&lt; 12 months)</li>
                    <li>Month-to-month contracts</li>
                    <li>High support ticket volume</li>
                    <li>Recent service issues</li>
                  </ul>
                </div>
              </Card>
              {/* Neutral Customers Card */}
              <Card title={
                <div className="segment-header-flex">
                  <span className="segment-title"><MinusCircle size={24} /> Neutral Customers</span>
                  <span className="segment-count">0 customers</span>
                </div>
              } className="segment-card neutral-card">
                <div className="segment-metrics-row">
                  <div className="metric-card">
                    <label>Avg Tenure</label>
                    <span className="metric-value">0</span>
                    <span className="metric-unit">months</span>
                  </div>
                  <div className="metric-card">
                    <label>Avg Revenue</label>
                    <span className="metric-value">$0</span>
                  </div>
                  <div className="metric-card">
                    <label>Churn Rate</label>
                    <span className="metric-value">0%</span>
                  </div>
                </div>
                <div className="segment-characteristics">
                  <h4>Opportunities</h4>
                  <ul>
                    <li>Moderate engagement levels</li>
                    <li>Upsell potential for services</li>
                    <li>Contract upgrade candidates</li>
                    <li>Stable usage patterns</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Segments;
