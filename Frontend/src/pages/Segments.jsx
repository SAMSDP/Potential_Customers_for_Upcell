import React, { useState, useEffect } from "react";
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
import { getSegmentStats, getRecommendations } from "../api/sampleApi";
import ScatterChart from "../components/Scatter"; // Adjust import if different

const Segments = () => {
  const [stats, setStats] = useState({
    loyal: { count: 0, avgTenure: 0, avgRevenue: 0, churnRate: 0 },
    atRisk: { count: 0, avgTenure: 0, avgRevenue: 0, churnRate: 0 },
    neutral: { count: 0, avgTenure: 0, avgRevenue: 0, churnRate: 0 },
    avgLTV: "₹0",
  });

  const [scatterData, setScatterData] = useState({ loyal: [], atrisk: [], neutral: [] });

  const buildScatterData = () => {
    const all = getRecommendations();

    const segmentMap = { loyal: [], atrisk: [], neutral: [] };

    all.forEach((c) => {
      const usage =
        (c.day_charge || 0) + (c.eve_charge || 0) + (c.night_charge || 0);
      const satisfaction = c.satisfaction_score ?? c.tenure ?? Math.floor(Math.random() * 100);

      const seg =
        c.segment === "loyal"
          ? "loyal"
          : ["atrisk", "highvalue", "at-risk"].includes(c.segment)
          ? "atrisk"
          : "neutral";

      segmentMap[seg].push({ x: usage, y: satisfaction, id: c.customer_id });
    });

    return segmentMap;
  };

  useEffect(() => {
    const s = getSegmentStats();
    setStats(s);
    setScatterData(buildScatterData());
  }, []);

  const refreshClusters = () => {
    const s = getSegmentStats();
    setStats(s);
    setScatterData(buildScatterData());
  };

  const exportSegmentData = () => {
    const csvRows = [
      ["Segment", "Count", "Avg Tenure", "Avg Revenue", "Churn Rate"].join(","),
      `Loyal,${stats.loyal.count},${stats.loyal.avgTenure},${stats.loyal.avgRevenue},${stats.loyal.churnRate}`,
      `At Risk,${stats.atRisk.count},${stats.atRisk.avgTenure},${stats.atRisk.avgRevenue},${stats.atRisk.churnRate}`,
      `Neutral,${stats.neutral.count},${stats.neutral.avgTenure},${stats.neutral.avgRevenue},${stats.neutral.churnRate}`,
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "segment_stats.csv";
    link.href = url;
    link.click();
  };

  return (
    <div className="segments-page">
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
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon green"><Heart /></div>
              <div className="stat-content">
                <h3>{stats.loyal.count}</h3>
                <p>Loyal Customers</p>
                <span className="trend positive">High retention, premium plans</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><AlertTriangle /></div>
              <div className="stat-content">
                <h3>{stats.atRisk.count}</h3>
                <p>At-Risk Customers</p>
                <span className="trend negative">Require immediate attention</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><MinusCircle /></div>
              <div className="stat-content">
                <h3>{stats.neutral.count}</h3>
                <p>Neutral Customers</p>
                <span className="trend neutral">Standard engagement level</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><TrendingUp /></div>
              <div className="stat-content">
                <h3>{stats.avgLTV}</h3>
                <p>Avg Lifetime Value</p>
                <span className="trend positive">Across all segments</span>
              </div>
            </div>
          </div>

          <div className="visualization-section">
            <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                  <h3>Customer Segment Clusters</h3>
                  <p style={{ color: "var(--gray-600)", margin: 0 }}>
                    Usage Score vs Satisfaction Score distribution
                  </p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button className="btn btn-secondary" onClick={refreshClusters}>
                    <RefreshCw size={16} style={{ marginRight: 4 }} /> Refresh
                  </button>
                  <button className="btn btn-primary" onClick={exportSegmentData}>
                    <Download size={16} style={{ marginRight: 4 }} /> Export
                  </button>
                </div>
              </div>

              <div style={{
                height: "100%",
                width: "100%",
                minHeight: 320,
                background: "#f9fafb",
                borderRadius: 8,
                padding: "1rem",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <ScatterChart data={scatterData} style={{ flex: 1, height: "100%", width: "100%" }} />
              </div>
            </div>
          </div>

          {/* Three Cards */}
          <div style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "2rem"
          }}>
            {/* Loyal Customers */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(30,35,90,0.05)",
              padding: "2.2rem 2rem 2rem 2rem",
              minWidth: 350,
              flex: "1 1 320px",
              borderLeft: "5px solid #35C25D",
              maxWidth: 380
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <Heart size={24} style={{ marginRight: 8 }} />
                <span style={{ fontWeight: "bold", fontSize: 22, marginRight: 10 }}>Loyal Customers</span>
                <span style={{ color: "#7d8590", fontWeight: 500, fontSize: 17 }}>{stats.loyal.count} customers</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 26 }}>
                <div style={{
                  background: "#f7f8fa",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "14px 24px",
                  flex: "1 1 110px",
                  minWidth: 95,
                  boxSizing: "border-box"
                }}>
                  <div style={{ color: "#727b88", fontWeight: 500, fontSize: 15, marginBottom: 4 }}>Avg Tenure</div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>
                    {stats.loyal.avgTenure} <span style={{ fontSize: 17, fontWeight: 500 }}>months</span>
                  </div>
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
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>{parseFloat(stats.loyal.churnRate).toFixed(1)}%</div>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Key Characteristics</div>
                <ul style={{ paddingLeft: 22, listStyle: "disc", margin: 0, color: "#565555ff", fontSize: 16 }}>
                  <li style={{ marginBottom: 5 }}>High tenure (24+ months)</li>
                  <li style={{ marginBottom: 5 }}>Premium service plans</li>
                  <li style={{ marginBottom: 5 }}>Low support ticket volume</li>
                  <li style={{ marginBottom: 5 }}>High satisfaction scores</li>
                </ul>
              </div>
            </div>
            {/* At-Risk Customers */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(30,35,90,0.05)",
              padding: "2.2rem 2rem 2rem 2rem",
              minWidth: 350,
              flex: "1 1 320px",
              borderLeft: "5px solid #FC3B47",
              maxWidth: 380
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <AlertTriangle size={24} style={{ marginRight: 8 }} />
                <span style={{ fontWeight: "bold", fontSize: 22, marginRight: 10 }}>At-Risk Customers</span>
                <span style={{ color: "#7d8590", fontWeight: 500, fontSize: 17 }}>{stats.atRisk.count} customers</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 26 }}>
                <div style={{
                  background: "#f7f8fa",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "14px 24px",
                  flex: "1 1 110px",
                  minWidth: 95,
                  boxSizing: "border-box"
                }}>
                  <div style={{ color: "#727b88", fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Avg Tenure</div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>
                    {stats.atRisk.avgTenure} <span style={{ fontSize: 17, fontWeight: 500 }}>months</span>
                  </div>
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
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>{parseFloat(stats.atRisk.churnRate).toFixed(1)}%</div>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Risk Factors</div>
                <ul style={{ paddingLeft: 22, listStyle: "disc", margin: 0, color: "#565555ff", fontSize: 16 }}>
                  <li style={{ marginBottom: 5 }}>Short tenure (&lt; 12 months)</li>
                  <li style={{ marginBottom: 5 }}>Month-to-month contracts</li>
                  <li style={{ marginBottom: 5 }}>High support ticket volume</li>
                  <li style={{ marginBottom: 5 }}>Recent service issues</li>
                </ul>
              </div>
            </div>
            {/* Neutral Customers */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(30,35,90,0.05)",
              padding: "2.2rem 2rem 2rem 2rem",
              minWidth: 350,
              flex: "1 1 320px",
              borderLeft: "5px solid #FFA509",
              maxWidth: 380
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <MinusCircle size={24} style={{ marginRight: 8 }} />
                <span style={{ fontWeight: "bold", fontSize: 22, marginRight: 10 }}>Neutral Customers</span>
                <span style={{ color: "#7d8590", fontWeight: 500, fontSize: 17 }}>{stats.neutral.count} customers</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 26 }}>
                <div style={{
                  background: "#f7f8fa",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "14px 24px",
                  flex: "1 1 110px",
                  minWidth: 95,
                  boxSizing: "border-box"
                }}>
                  <div style={{ color: "#727b88", fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Avg Tenure</div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: 22, lineHeight: "28px" }}>
                    {stats.neutral.avgTenure} <span style={{ fontSize: 17, fontWeight: 500 }}>months</span>
                  </div>
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
