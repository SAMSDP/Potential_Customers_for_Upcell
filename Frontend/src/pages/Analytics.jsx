
import React, { useState } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Filter, Download, Database } from "lucide-react";
import "../../assets/css/main.css";

const Analytics = () => {
  // State for filters and table data (stubbed for now)
  const [tenure, setTenure] = useState("");
  const [contract, setContract] = useState("");
  const [service, setService] = useState("");
  const [customers, setCustomers] = useState([]); // Table data

  // Handler stubs
  const applyFilters = () => {};
  const exportCustomerData = () => {};

  return (
    <div className="analytics-page">
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
        <ul className="nav-menu">
          <li><a href="/" className="nav-link" data-page="dashboard"><Home size={18} />Dashboard</a></li>
          <li><a href="/analytics" className="nav-link active" data-page="analytics"><BarChart3 size={18} />Analytics</a></li>
          <li><a href="/prediction" className="nav-link" data-page="prediction"><Brain size={18} />Predictions</a></li>
          <li><a href="/segments" className="nav-link" data-page="segments"><Users size={18} />Segments</a></li>
          <li><a href="/recommendations" className="nav-link" data-page="recommendations"><Target size={18} />Recommendations</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>Customer Analytics</h1>
          <p>Deep dive into customer behavior patterns and trends</p>
        </header>

        <div className="filters-section" style={{background: 'white', padding: '1.5rem', borderRadius: 16, marginBottom: '2rem', boxShadow: 'var(--shadow-md)'}}>
          <h3 style={{marginBottom: '1rem'}}>Filters</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
            <div className="form-group">
              <label className="form-label">Tenure</label>
              <select className="form-select" value={tenure} onChange={e => setTenure(e.target.value)}>
                <option value="">All Customers</option>
                <option value="new">New (≤ 12 months)</option>
                <option value="old">Experienced ({'>'} 24 months)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contract Type</label>
              <select className="form-select" value={contract} onChange={e => setContract(e.target.value)}>
                <option value="">All Contracts</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Service Type</label>
              <select className="form-select" value={service} onChange={e => setService(e.target.value)}>
                <option value="">All Services</option>
                <option value="fiber">Fiber Optic</option>
                <option value="dsl">DSL</option>
                <option value="no">No Internet</option>
              </select>
            </div>
            <div className="form-group" style={{display: 'flex', alignItems: 'end'}}>
              <button className="btn btn-primary" onClick={applyFilters}>
                <Filter size={16} style={{marginRight: 4}} />Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="charts-row">
            <div className="chart-card">
              <h3>Call Usage Analysis</h3>
              {/* Chart placeholder */}
              <div style={{height: 220, background: '#f9fafb', borderRadius: 8}}></div>
            </div>
            <div className="chart-card">
              <h3>Churn Distribution by Contract</h3>
              {/* Chart placeholder */}
              <div style={{height: 220, background: '#f9fafb', borderRadius: 8}}></div>
            </div>
          </div>
          <div className="charts-row">
            <div className="chart-card">
              <h3>Customer Support Metrics</h3>
              {/* Chart placeholder */}
              <div style={{height: 220, background: '#f9fafb', borderRadius: 8}}></div>
            </div>
            <div className="chart-card">
              <h3>Revenue Distribution</h3>
              {/* Chart placeholder */}
              <div style={{height: 220, background: '#f9fafb', borderRadius: 8}}></div>
            </div>
          </div>
          <div className="table-section">
            <div className="table-container">
              <div style={{padding: '1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Customer Details</h3>
                <button className="btn btn-secondary" onClick={exportCustomerData}>
                  <Download size={16} style={{marginRight: 4}} />Export Data
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Tenure</th>
                    <th>Contract</th>
                    <th>Monthly Charges</th>
                    <th>Churn Risk</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Table rows go here, stubbed for now */}
                  {customers.length === 0 && (
                    <tr><td colSpan={6} style={{textAlign: 'center', color: '#888'}}>No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
