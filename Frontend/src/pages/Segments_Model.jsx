// SegmentsClient.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT
import {
  Home,
  TrendingUp,
  BarChart3,
  Brain,
  Users,
  Target,
  Heart,
  AlertTriangle,
  MinusCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import "../../assets/css/main.css";
import Card from "../components/Card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- Helper functions (match backend) ---

// Extract churn probability safely
function getChurnProb(customer) {
  let v =
    customer.churn_probability ??
    customer.Churn_Probability ??
    customer.churnProbability ??
    customer.ChurnProbability ??
    null;

  if (typeof v === "string") v = parseFloat(v);
  if (!Number.isFinite(v)) return null;

  // Normalize if given as %
  return v > 1 ? v / 100 : v;
}

// Categorize customer based on avg_prob
function categorize_customer(churn_prob, avg_prob, tolerance = 0.05) {
  if (churn_prob < avg_prob - tolerance) {
    return "loyal";
  } else if (churn_prob > avg_prob + tolerance) {
    return "at_risk";
  } else {
    return "neutral";
  }
}

const SegmentsModel = () => {
  const location = useLocation();
  const { apiResponse } = location.state || {};
  const navigate = useNavigate(); // ADD THIS LINE

  const [finalResponse, setFinalResponse] = useState(apiResponse); // ADD THIS LINE

  const [stats, setStats] = useState({
    loyal: 0,
    atRisk: 0,
    neutral: 0,
    avgLTV: 0,
  });

  const [tenureData, setTenureData] = useState({
    loyal: [],
    neutral: [],
    atRisk: [],
  });

  const [metrics, setMetrics] = useState({
    loyal: { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 },
    neutral: { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 },
    atRisk: { count: 0, avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0 },
  });

  useEffect(() => {
    if (!apiResponse || apiResponse.length === 0) return;

    // Extract valid churn probabilities
    const probs = apiResponse
      .map((c) => getChurnProb(c))
      .filter((v) => Number.isFinite(v));

    const avg_prob =
      probs.length > 0
        ? probs.reduce((sum, v) => sum + v, 0) / probs.length
        : 0;

    // Segment counters
    const segment_counts = { loyal: 0, neutral: 0, at_risk: 0 };

    const segment_counts_with_tenure = {
      loyal: { count: 0, tenure: [] },
      neutral: { count: 0, tenure: [] },
      at_risk: { count: 0, tenure: [] },
    };

    const segment_metrics = {
      loyal: { avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0, count: 0 },
      neutral: { avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0, count: 0 },
      at_risk: { avg_tenure: 0, avg_revenue: 0, avg_churn_rate: 0, count: 0 },
    };

    apiResponse.forEach((customer) => {
      const churnProb = getChurnProb(customer);
      if (!Number.isFinite(churnProb)) return;

      const segment = categorize_customer(churnProb, avg_prob);

      // Counts
      segment_counts[segment] += 1;

      // Tenure
      segment_counts_with_tenure[segment].count += 1;
      segment_counts_with_tenure[segment].tenure.push(customer.tenure);

      // Revenue calc
      const revenue =
        (customer.day_charge || 0) +
        (customer.eve_charge || 0) +
        (customer.night_charge || 0) +
        (customer.intl_charge || 0);

      // Metrics
      segment_metrics[segment].avg_tenure += customer.tenure || 0;
      segment_metrics[segment].avg_revenue += revenue;
      segment_metrics[segment].avg_churn_rate +=
        customer.churn_prediction || 0;
      segment_metrics[segment].count += 1;
    });

    // Final averages
    for (let seg in segment_metrics) {
      const count = segment_metrics[seg].count;
      if (count > 0) {
        segment_metrics[seg].avg_tenure /= count;
        segment_metrics[seg].avg_revenue /= count;
        // Already binary (0/1) → take mean, convert to %
        segment_metrics[seg].avg_churn_rate =
          (segment_metrics[seg].avg_churn_rate / count) * 100;
      }
    }

    // Set states
    setStats({
      loyal: segment_counts.loyal,
      neutral: segment_counts.neutral,
      atRisk: segment_counts.at_risk,
      avgLTV: (
        (segment_metrics.loyal.avg_revenue +
          segment_metrics.neutral.avg_revenue +
          segment_metrics.at_risk.avg_revenue) /
        3
      ).toFixed(2),
    });

    const mapTenure = (arr) =>
      arr.map((t) => ({
        tenure: t,
        score: Math.floor(Math.random() * 100) + 1,
      }));

    setTenureData({
      loyal: mapTenure(segment_counts_with_tenure.loyal.tenure),
      neutral: mapTenure(segment_counts_with_tenure.neutral.tenure),
      atRisk: mapTenure(segment_counts_with_tenure.at_risk.tenure),
    });

    setMetrics({
      loyal: segment_metrics.loyal,
      neutral: segment_metrics.neutral,
      atRisk: segment_metrics.at_risk,
    });
  }, [apiResponse]);

  const refreshClusters = () => {
    const mapTenure = (arr) =>
      arr.map((t) => ({
        tenure: t,
        score: Math.floor(Math.random() * 100) + 1,
      }));

    setTenureData((prev) => ({
      loyal: mapTenure(prev.loyal.map((d) => d.tenure)),
      neutral: mapTenure(prev.neutral.map((d) => d.tenure)),
      atRisk: mapTenure(prev.atRisk.map((d) => d.tenure)),
    }));
  };

  const exportSegmentData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ stats, tenureData, metrics }, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = "segments-data.json";
    link.click();
  };

  return (
    <div className="segments-page">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
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
            <a
              href="/recommendations"
              className="nav-link"
              data-page="recommendations"
            >
              <Target size={18} />
              Recommendations
            </a>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <header className="page-header">
          <h1>Customer Segments</h1>
          <p>Visualize customer clusters and behavioral patterns</p>
        </header>

        <div className="segments-dashboard">
          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon green">
                <Heart />
              </div>
              <div className="stat-content">
                <h3>{stats.loyal}</h3>
                <p>Loyal Customers</p>
                <span className="trend positive">
                  High retention, premium plans
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">
                <AlertTriangle />
              </div>
              <div className="stat-content">
                <h3>{stats.atRisk}</h3>
                <p>At-Risk Customers</p>
                <span className="trend negative">
                  Require immediate attention
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <MinusCircle />
              </div>
              <div className="stat-content">
                <h3>{stats.neutral}</h3>
                <p>Neutral Customers</p>
                <span className="trend neutral">Standard engagement level</span>
              </div>
            </div>
          </div>

          {/* Cluster Chart */}
          <div className="visualization-section">
            <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <h3>Customer Segment Clusters</h3>
                  <p style={{ color: "var(--gray-600)", margin: 0 }}>
                    Usage Score vs Tenure distribution
                  </p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button className="btn btn-secondary" onClick={refreshClusters}>
                    <RefreshCw size={16} style={{ marginRight: 4 }} />
                    Refresh
                  </button>
                  <button className="btn btn-primary" onClick={exportSegmentData}>
                    <Download size={16} style={{ marginRight: 4 }} />
                    Export
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="tenure" name="Tenure" unit="mo" />
                  <YAxis type="number" dataKey="score" name="Usage Score" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter name="Loyal" data={tenureData.loyal} fill="#4ade80" />
                  <Scatter
                    name="Neutral"
                    data={tenureData.neutral}
                    fill="#f59e0b"
                  />
                  <Scatter
                    name="At-Risk"
                    data={tenureData.atRisk}
                    fill="#f87171"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Segment Cards */}
          <div className="segment-details">
            <div className="segment-cards-grid">
              {/* Loyal */}
              <Card
                title={
                  <div className="segment-header-flex">
                    <span className="segment-title">
                      <Heart size={24} /> Loyal Customers
                    </span>
                    <span className="segment-count">
                      {metrics.loyal.count || 0} customers
                    </span>
                  </div>
                }
                className="segment-card loyal-card"
              >
                <div className="segment-metrics-row">
                  <div className="metric-card">
                    <label>Avg Tenure</label>
                    <span className="metric-value">
                      {metrics.loyal.avg_tenure?.toFixed(1) || 0}
                    </span>
                    <span className="metric-unit">months</span>
                  </div>
                  <div className="metric-card">
                    <label>Avg Revenue</label>
                    <span className="metric-value">
                      ${metrics.loyal.avg_revenue?.toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="metric-card">
                    <label>Churn Rate</label>
                    <span className="metric-value">
                      {metrics.loyal.avg_churn_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* At-Risk */}
              <Card
                title={
                  <div className="segment-header-flex">
                    <span className="segment-title">
                      <AlertTriangle size={24} /> At-Risk Customers
                    </span>
                    <span className="segment-count">
                      {metrics.atRisk.count || 0} customers
                    </span>
                  </div>
                }
                className="segment-card at-risk-card"
              >
                <div className="segment-metrics-row">
                  <div className="metric-card">
                    <label>Avg Tenure</label>
                    <span className="metric-value">
                      {metrics.atRisk.avg_tenure?.toFixed(1) || 0}
                    </span>
                    <span className="metric-unit">months</span>
                  </div>
                  <div className="metric-card">
                    <label>Avg Revenue</label>
                    <span className="metric-value">
                      ${metrics.atRisk.avg_revenue?.toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="metric-card">
                    <label>Churn Rate</label>
                    <span className="metric-value">
                      {metrics.atRisk.avg_churn_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Neutral */}
              <Card
                title={
                  <div className="segment-header-flex">
                    <span className="segment-title">
                      <MinusCircle size={24} /> Neutral Customers
                    </span>
                    <span className="segment-count">
                      {metrics.neutral.count || 0} customers
                    </span>
                  </div>
                }
                className="segment-card neutral-card"
              >
                <div className="segment-metrics-row">
                  <div className="metric-card">
                    <label>Avg Tenure</label>
                    <span className="metric-value">
                      {metrics.neutral.avg_tenure?.toFixed(1) || 0}
                    </span>
                    <span className="metric-unit">months</span>
                  </div>
                  <div className="metric-card">
                    <label>Avg Revenue</label>
                    <span className="metric-value">
                      ${metrics.neutral.avg_revenue?.toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="metric-card">
                    <label>Churn Rate</label>
                    <span className="metric-value">
                      {metrics.neutral.avg_churn_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          {/* Segments Navigation */}
          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/recommendations_models", { state: { apiResponse: finalResponse } })}
          >
            Go to Recommendations →
          </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SegmentsModel;