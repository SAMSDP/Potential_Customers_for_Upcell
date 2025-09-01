import React, { useState, useEffect } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Heart, AlertTriangle, MinusCircle, RefreshCw, Download } from "lucide-react";
import "../../assets/css/main.css";
import Card from "../components/Card";
import axios from "axios";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Segments = () => {
  const [stats, setStats] = useState({ loyal: 0, atRisk: 0, neutral: 0, avgLTV: 0 });
  const [tenureData, setTenureData] = useState({ loyal: [], neutral: [], atRisk: [] });
  const [metrics, setMetrics] = useState({
    loyal: { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 },
    neutral: { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 },
    atRisk: { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 }
  });

  const fetchSegmentCounts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/segments/customer-segments/");
      setStats(prev => ({
        ...prev,
        loyal: res.data.loyal,
        neutral: res.data.neutral,
        atRisk: res.data.at_risk
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSegmentTenure = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/segments/customer-segments-tenure/");
      const mapTenure = arr => arr.map(t => ({ tenure: t, score: Math.floor(Math.random() * 100) + 1 }));
      setTenureData({
        loyal: mapTenure(res.data.loyal?.tenure || []),
        neutral: mapTenure(res.data.neutral?.tenure || []),
        atRisk: mapTenure(res.data.at_risk?.tenure || [])
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSegmentMetrics = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/segments/customer-segments-metrics/");
      setMetrics({
        loyal: res.data.loyal || { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 },
        neutral: res.data.neutral || { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 },
        atRisk: res.data.at_risk || { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 }
      });
      setStats(prev => ({
        ...prev,
        avgLTV: (
          ((res.data.loyal?.avg_revenue || 0) +
          (res.data.neutral?.avg_revenue || 0) +
          (res.data.at_risk?.avg_revenue || 0)) / 3
        ).toFixed(2)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSegmentCounts();
    fetchSegmentTenure();
    fetchSegmentMetrics();
  }, []);

  const refreshClusters = () => fetchSegmentTenure();
  const exportSegmentData = () => { /* export logic */ };

  return (
    <div className="segments-page">
      <nav className="sidebar">
        <div className="logo"><TrendingUp size={24} /><span>CustomerIQ</span></div>
        <ul className="nav-menu">
          <li>
            <a href="/" className="nav-link" data-page="dashboard">
              <Home size={18} />
              Dashboard
            </a>
          </li>
          <li>
            <a href="/analytics" className="nav-link" data-page="analytics">
              <BarChart3 size={18} />
              Analytics
            </a>
          </li>
          <li>
            <a href="/prediction" className="nav-link" data-page="prediction">
              <Brain size={18} />
              Predictions
            </a>
          </li>
          <li>
            <a href="/segments" className="nav-link active" data-page="segments">
              <Users size={18} />
              Segments
            </a>
          </li>
          <li>
            <a href="/recommendations" className="nav-link" data-page="recommendations">
              <Target size={18} />
              Recommendations
            </a>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>Customer Segments</h1>
          <p>Visualize customer clusters and behavioral patterns</p>
        </header>

        <div className="segments-dashboard">
          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card"><div className="stat-icon green"><Heart /></div><div className="stat-content"><h3>{stats.loyal}</h3><p>Loyal Customers</p><span className="trend positive">High retention, premium plans</span></div></div>
            <div className="stat-card"><div className="stat-icon red"><AlertTriangle /></div><div className="stat-content"><h3>{stats.atRisk}</h3><p>At-Risk Customers</p><span className="trend negative">Require immediate attention</span></div></div>
            <div className="stat-card"><div className="stat-icon orange"><MinusCircle /></div><div className="stat-content"><h3>{stats.neutral}</h3><p>Neutral Customers</p><span className="trend neutral">Standard engagement level</span></div></div>
            <div className="stat-card"><div className="stat-icon blue"><TrendingUp /></div><div className="stat-content"><h3>${stats.avgLTV}</h3><p>Avg Lifetime Value</p><span className="trend positive">Across all segments</span></div></div>
          </div>

          {/* Cluster Chart */}
          <div className="visualization-section">
            <div className="chart-card" style={{gridColumn: '1 / -1'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <div><h3>Customer Segment Clusters</h3><p style={{color: 'var(--gray-600)', margin: 0}}>Usage Score vs Tenure distribution</p></div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button className="btn btn-secondary" onClick={refreshClusters}><RefreshCw size={16} style={{marginRight: 4}} />Refresh</button>
                  <button className="btn btn-primary" onClick={exportSegmentData}><Download size={16} style={{marginRight: 4}} />Export</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="tenure" name="Tenure" unit="mo" />
                  <YAxis type="number" dataKey="score" name="Usage Score" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="Loyal" data={tenureData.loyal} fill="#4ade80" />
                  <Scatter name="Neutral" data={tenureData.neutral} fill="#f59e0b" />
                  <Scatter name="At-Risk" data={tenureData.atRisk} fill="#f87171" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Segment Cards with Points */}
          <div className="segment-details">
            <div className="segment-cards-grid">
              {/* Loyal */}
              <Card title={<div className="segment-header-flex"><span className="segment-title"><Heart size={24} /> Loyal Customers</span><span className="segment-count">{metrics.loyal.count || 0} customers</span></div>} className="segment-card loyal-card">
                <div className="segment-metrics-row">
                  <div className="metric-card"><label>Avg Tenure</label><span className="metric-value">{metrics.loyal.avg_tenure?.toFixed(1) || 0}</span><span className="metric-unit">months</span></div>
                  <div className="metric-card"><label>Avg Revenue</label><span className="metric-value">${metrics.loyal.avg_revenue?.toFixed(2) || 0}</span></div>
                  <div className="metric-card"><label>Churn Rate</label><span className="metric-value">{((metrics.loyal.avg_churn_rate || 0)*100).toFixed(1)}%</span></div>
                </div>
                <div style={{
                  background: "#f7f8fa",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "14px 24px",
                  flex: "1 1 110px",
                  minWidth: 95,
                  boxSizing: "border-box"
                }}>
                  <div style={{ color: "#727b88", fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Avg Revenue</div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>{stats.loyal.avgRevenue}</div>
                </div>
              </Card>

              {/* At-Risk */}
              <Card title={<div className="segment-header-flex"><span className="segment-title"><AlertTriangle size={24} /> At-Risk Customers</span><span className="segment-count">{metrics.atRisk.count || 0} customers</span></div>} className="segment-card at-risk-card">
                <div className="segment-metrics-row">
                  <div className="metric-card"><label>Avg Tenure</label><span className="metric-value">{metrics.atRisk.avg_tenure?.toFixed(1) || 0}</span><span className="metric-unit">months</span></div>
                  <div className="metric-card"><label>Avg Revenue</label><span className="metric-value">${metrics.atRisk.avg_revenue?.toFixed(2) || 0}</span></div>
                  <div className="metric-card"><label>Churn Rate</label><span className="metric-value">{((metrics.atRisk.avg_churn_rate || 0)*100).toFixed(1)}%</span></div>
                </div>
                <div style={{
                  background: "#f7f8fa",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "14px 24px",
                  flex: "1 1 110px",
                  minWidth: 95,
                  boxSizing: "border-box"
                }}>
                  <div style={{ color: "#727b88", fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Avg Revenue</div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>{stats.atRisk.avgRevenue}</div>
                </div>
              </Card>

              {/* Neutral */}
              <Card title={<div className="segment-header-flex"><span className="segment-title"><MinusCircle size={24} /> Neutral Customers</span><span className="segment-count">{metrics.neutral.count || 0} customers</span></div>} className="segment-card neutral-card">
                <div className="segment-metrics-row">
                  <div className="metric-card"><label>Avg Tenure</label><span className="metric-value">{metrics.neutral.avg_tenure?.toFixed(1) || 0}</span><span className="metric-unit">months</span></div>
                  <div className="metric-card"><label>Avg Revenue</label><span className="metric-value">${metrics.neutral.avg_revenue?.toFixed(2) || 0}</span></div>
                  <div className="metric-card"><label>Churn Rate</label><span className="metric-value">{((metrics.neutral.avg_churn_rate || 0)*100).toFixed(1)}%</span></div>
                </div>
                <div style={{
                  background: "#f7f8fa",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "14px 24px",
                  flex: "1 1 110px",
                  minWidth: 95,
                  boxSizing: "border-box"
                }}>
                  <div style={{ color: "#727b88", fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Avg Revenue</div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>{stats.neutral.avgRevenue}</div>
                </div>
                <div style={{
                  background: "#f7f8fa",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "14px 24px",
                  flex: "1 1 110px",
                  minWidth: 95,
                  boxSizing: "border-box"
                }}>
                  <div style={{ color: "#727b88", fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Churn Rate</div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>{parseFloat(stats.neutral.churnRate).toFixed(1)}%</div>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Opportunities</div>
                <ul style={{ paddingLeft: 22, listStyle: "disc", margin: 0, color: "#565555ff", fontSize: 16 }}>
                  <li style={{ marginBottom: 5 }}>Moderate engagement levels</li>
                  <li style={{ marginBottom: 5 }}>Upsell potential for services</li>
                  <li style={{ marginBottom: 5 }}>Contract upgrade candidates</li>
                  <li style={{ marginBottom: 5 }}>Stable usage patterns</li>
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
