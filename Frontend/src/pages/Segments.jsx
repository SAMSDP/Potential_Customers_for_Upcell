
import React, { useState } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Heart, AlertTriangle, MinusCircle, RefreshCw, Download } from "lucide-react";
import "../../assets/css/main.css";

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
            {/* Loyal Customers Card */}
            <div className="segment-card loyal">
              <div className="segment-header">
                <h3><Heart size={20} />Loyal Customers</h3>
                <span className="segment-count">0 customers</span>
              </div>
              <div className="segment-metrics">
                <div className="metric"><label>Avg Tenure</label><span>0 months</span></div>
                <div className="metric"><label>Avg Revenue</label><span>$0</span></div>
                <div className="metric"><label>Churn Rate</label><span>0%</span></div>
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
            </div>
            {/* At-Risk Customers Card */}
            <div className="segment-card at-risk">
              <div className="segment-header">
                <h3><AlertTriangle size={20} />At-Risk Customers</h3>
                <span className="segment-count">0 customers</span>
              </div>
              <div className="segment-metrics">
                <div className="metric"><label>Avg Tenure</label><span>0 months</span></div>
                <div className="metric"><label>Avg Revenue</label><span>$0</span></div>
                <div className="metric"><label>Churn Rate</label><span>0%</span></div>
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
            </div>
            {/* Neutral Customers Card */}
            <div className="segment-card neutral">
              <div className="segment-header">
                <h3><MinusCircle size={20} />Neutral Customers</h3>
                <span className="segment-count">0 customers</span>
              </div>
              <div className="segment-metrics">
                <div className="metric"><label>Avg Tenure</label><span>0 months</span></div>
                <div className="metric"><label>Avg Revenue</label><span>$0</span></div>
                <div className="metric"><label>Churn Rate</label><span>0%</span></div>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Segments;
