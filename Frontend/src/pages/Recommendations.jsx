
import React, { useState } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Crown, Shield, Download, RefreshCw, FileText, Send, TrendingUp as TrendingUpIcon, Calendar } from "lucide-react";
import "../../assets/css/main.css";

const Recommendations = () => {
  // State for recommendations and filters (stubbed for now)
  const [recommendations] = useState([]);
  const [segment, setSegment] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");

  // Handler stubs
  const applyFilters = () => {};
  const generateRecommendations = () => {};
  const exportRecommendations = format => {};
  const sendToSalesTeam = () => {};

  return (
    <div className="recommendations-page">
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
        <ul className="nav-menu">
          <li><a href="/" className="nav-link" data-page="dashboard"><Home size={18} />Dashboard</a></li>
          <li><a href="/analytics" className="nav-link" data-page="analytics"><BarChart3 size={18} />Analytics</a></li>
          <li><a href="/prediction" className="nav-link" data-page="prediction"><Brain size={18} />Predictions</a></li>
          <li><a href="/segments" className="nav-link" data-page="segments"><Users size={18} />Segments</a></li>
          <li><a href="/recommendations" className="nav-link active" data-page="recommendations"><Target size={18} />Recommendations</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>Smart Recommendations</h1>
          <p>AI-powered personalized suggestions for customer engagement</p>
        </header>

        <div className="recommendations-dashboard">
          <div className="strategy-overview">
            <div className="strategy-card loyal">
              <div className="strategy-header"><Crown size={24} /><h3>Loyal Customers</h3></div>
              <div className="strategy-content">
                <p>Premium upsell opportunities and exclusive offers</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">0</span><span className="stat-label">Recommendations</span></div>
                  <div className="stat"><span className="stat-value">0%</span><span className="stat-label">Conversion Rate</span></div>
                </div>
              </div>
            </div>
            <div className="strategy-card at-risk">
              <div className="strategy-header"><Shield size={24} /><h3>At-Risk Customers</h3></div>
              <div className="strategy-content">
                <p>Retention offers and service improvement plans</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">0</span><span className="stat-label">Recommendations</span></div>
                  <div className="stat"><span className="stat-value">0%</span><span className="stat-label">Retention Rate</span></div>
                </div>
              </div>
            </div>
            <div className="strategy-card neutral">
              <div className="strategy-header"><TrendingUpIcon size={24} /><h3>Neutral Customers</h3></div>
              <div className="strategy-content">
                <p>Engagement campaigns and service discovery</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">0</span><span className="stat-label">Recommendations</span></div>
                  <div className="stat"><span className="stat-value">0%</span><span className="stat-label">Engagement Rate</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="filters-section" style={{background: 'white', padding: '1.5rem', borderRadius: 16, margin: '2rem 0', boxShadow: 'var(--shadow-md)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3>Filter Recommendations</h3>
              <button className="btn btn-primary" onClick={generateRecommendations}><RefreshCw size={16} style={{marginRight: 4}} />Refresh Recommendations</button>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Segment</label>
                <select className="form-select" value={segment} onChange={e => setSegment(e.target.value)}>
                  <option value="">All Segments</option>
                  <option value="loyal">Loyal</option>
                  <option value="at-risk">At Risk</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Recommendation Type</label>
                <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="upsell">Upsell</option>
                  <option value="retention">Retention</option>
                  <option value="engagement">Engagement</option>
                </select>
              </div>
              <div className="form-group" style={{display: 'flex', alignItems: 'end'}}>
                <button className="btn btn-secondary" onClick={applyFilters}><Target size={16} style={{marginRight: 4}} />Apply Filters</button>
              </div>
            </div>
          </div>

          <div className="recommendations-grid">
            {/* Recommendation cards go here, stubbed for now */}
            {recommendations.length === 0 && (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#888'}}>No recommendations</div>
            )}
          </div>

          <div className="export-section">
            <div className="chart-card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h3>Export Recommendations</h3>
                  <p style={{color: 'var(--gray-600)', margin: 0}}>Download personalized recommendations for your team</p>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button className="btn btn-secondary" onClick={() => exportRecommendations('csv')}><FileText size={16} style={{marginRight: 4}} />Export CSV</button>
                  <button className="btn btn-secondary" onClick={() => exportRecommendations('pdf')}><FileText size={16} style={{marginRight: 4}} />Export PDF Report</button>
                  <button className="btn btn-success" onClick={sendToSalesTeam}><Send size={16} style={{marginRight: 4}} />Send to Sales Team</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
