
import React, { useState, useEffect } from "react";
import Chart from "../components/Chart";
import { getCdr } from "../api/cdrApi";
import { getTelco } from "../api/churnApi";
import { getSupport } from "../api/supportApi";
import support from "../database/support.js";
import telco from "../database/telco.js";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Filter, Download, Database } from "lucide-react";
import "../../assets/css/main.css";

const Analytics = () => {
  // State for filters and table data (stubbed for now)
  const [tenure, setTenure] = useState("");
  const [contract, setContract] = useState("");
  const [service, setService] = useState("");
  const [customers, setCustomers] = useState([]); // Table data


  // Chart data state
  const [callUsageData, setCallUsageData] = useState(null);
  const [churnDistributionData, setChurnDistributionData] = useState(null);
  const [supportMetricsData, setSupportMetricsData] = useState(null);
  const [revenueDistributionData, setRevenueDistributionData] = useState(null);

  // Filter handler
  const applyFilters = () => {
    let filtered = telco.data;
    // Tenure filter
    if (tenure === "new") {
      filtered = filtered.filter(cust => cust.tenure <= 12);
    } else if (tenure === "old") {
      filtered = filtered.filter(cust => cust.tenure > 24);
    }
    // Service Type filter
    if (service === "fiber") {
      filtered = filtered.filter(cust => cust.internet_service === "Fiber Optic");
    } else if (service === "dsl") {
      filtered = filtered.filter(cust => cust.internet_service === "DSL");
    } else if (service === "no") {
      filtered = filtered.filter(cust => cust.internet_service === "No Internet");
    }
    // Contract Type filter
    if (contract === "month") {
      filtered = filtered.filter(cust => cust.contract === "Month-to-month");
    } else if (contract === "year") {
      filtered = filtered.filter(cust => cust.contract === "One year" || cust.contract === "Two year");
    }
    // Map to table format
    const customerRows = filtered.slice(0, 100).map(cust => {
      let churn_risk = "Low";
      if (cust.churn === "Yes") {
        churn_risk = "High";
      } else if (cust.tenure <= 12) {
        churn_risk = "Medium";
      }
      return {
        customer_id: cust.customer_id,
        tenure: cust.tenure,
        contract: cust.contract,
        monthly_charges: cust.monthly_charges,
        churn_risk,
        status: cust.churn === "Yes" ? "Churned" : "Active",
      };
    });
    setCustomers(customerRows);
  };
  const exportCustomerData = () => {};

  useEffect(() => {
    // Populate Customer Details table from telco.js
    // Churn Risk: High = churned, Medium = tenure <= 12 and not churned, Low = tenure > 12 and not churned
    const customerRows = telco.data.slice(0, 100).map(cust => {
      let churn_risk = "Low";
      if (cust.churn === "Yes") {
        churn_risk = "High";
      } else if (cust.tenure <= 12) {
        churn_risk = "Medium";
      }
      return {
        customer_id: cust.customer_id,
        tenure: cust.tenure,
        contract: cust.contract,
        monthly_charges: cust.monthly_charges,
        churn_risk,
        status: cust.churn === "Yes" ? "Churned" : "Active",
      };
    });
    setCustomers(customerRows);
    // Call Usage Analysis
    const cdrData = getCdr();
    setCallUsageData({
      labels: ["Voice Minutes", "Data Usage (GB)", "SMS Count"],
      datasets: [
        {
          label: "Average per Customer",
          data: [cdrData.avgVoiceMins, cdrData.avgDataUsage, cdrData.avgSms],
          backgroundColor: [
            "#3b82f6", // blue
            "#10b981", // green
            "#fbbf24"  // yellow
          ],
          borderRadius: 6,
        }
      ],
    });

    // Churn Distribution by Contract (dummy data)
    setChurnDistributionData({
      labels: ["Month-to-month", "One year", "Two year"],
      datasets: [
        {
          label: "Churn Rate %",
          data: [28, 12, 5],
          backgroundColor: [
            "#ef4444", // red
            "#3b82f6", // blue
            "#10b981"  // green
          ],
          borderRadius: 6,
        }
      ],
    });

    // Customer Support Metrics: Donut chart by ticket_type
    const ticketTypeCounts = {};
    support.data.forEach(ticket => {
      ticketTypeCounts[ticket.ticket_type] = (ticketTypeCounts[ticket.ticket_type] || 0) + 1;
    });
    const ticketTypeLabels = Object.keys(ticketTypeCounts);
    const ticketTypeData = Object.values(ticketTypeCounts);
    setSupportMetricsData({
      labels: ticketTypeLabels,
      datasets: [
        {
          label: "Tickets",
          data: ticketTypeData,
          backgroundColor: [
            "#3b82f6", "#10b981", "#fbbf24", "#ef4444", "#6366f1", "#f472b6"
          ],
        }
      ],
    });

    // Revenue Distribution: Bar chart by actual INR values from telco.js, with rounded bins (e.g., 10K, 50K)
    const INR_RATE = 83; // 1 USD = 83 INR (approx, update as needed)
    const inrValues = telco.data.map(cust => Math.round((cust.total_charges || 0) * INR_RATE));
    // Define rounded bins up to 10L (₹1,000,000)
    const bins = [0, 10000, 25000, 50000, 100000, 200000, 500000, 1000000];
    const binLabels = [
      '₹0-10K', '₹10K-25K', '₹25K-50K', '₹50K-1L', '₹1L-2L', '₹2L-5L', '₹5L-10L'
    ];
    const binCounts = Array(binLabels.length).fill(0);
    inrValues.forEach(val => {
      let idx = bins.findIndex((b, i) => val >= b && (i === bins.length - 1 || val < bins[i + 1]));
      if (idx === -1 || idx >= binLabels.length) return; // Exclude values above 10L
      binCounts[idx]++;
    });
    setRevenueDistributionData({
      labels: binLabels,
      datasets: [
        {
          label: "Customers",
          data: binCounts,
          backgroundColor: [
            "#3b82f6", "#10b981", "#fbbf24", "#ef4444", "#6366f1", "#f472b6", "#a3e635"
          ],
          borderRadius: 6,
        }
      ],
    });
  }, []);

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


        <div className="analytics-grid">
          <div className="charts-row">
            <div className="chart-card">
              <h3>Call Usage Analysis</h3>
              {callUsageData ? (
                <Chart
                  type="bar"
                  data={callUsageData}
                  options={{
                    indexAxis: "x",
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                  height={220}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="chart-card">
              <h3>Churn Distribution by Contract</h3>
              {churnDistributionData ? (
                <Chart
                  type="bar"
                  data={churnDistributionData}
                  options={{
                    indexAxis: "x",
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                  height={220}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
          <div className="charts-row">
            <div className="chart-card">
              <h3>Customer Support Metrics</h3>
              {supportMetricsData ? (
                <Chart
                  type="doughnut"
                  data={supportMetricsData}
                  options={{
                    plugins: { legend: { display: true, position: 'bottom' } },
                  }}
                  height={220}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="chart-card">
              <h3>Revenue Distribution</h3>
              {revenueDistributionData ? (
                <Chart
                  type="bar"
                  data={revenueDistributionData}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
                  }}
                  height={220}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
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
                  {customers.length === 0 ? (
                    <tr><td colSpan={6} style={{textAlign: 'center', color: '#888'}}>No data</td></tr>
                  ) : (
                    customers.map((cust, idx) => {
                      // Churn Risk badge color
                      let riskClass = 'low';
                      if (cust.churn_risk === 'High') riskClass = 'high';
                      else if (cust.churn_risk === 'Medium') riskClass = 'medium';
                      // Status badge color
                      let statusClass = cust.status === 'Churned' ? 'churned' : 'active';
                      return (
                        <tr key={cust.customer_id + idx}>
                          <td>{cust.customer_id}</td>
                          <td>{cust.tenure}</td>
                          <td>{cust.contract}</td>
                          <td>₹{cust.monthly_charges.toLocaleString()}</td>
                          <td>
                            <span className={`badge-risk ${riskClass}`}>{cust.churn_risk}</span>
                          </td>
                          <td>
                            <span className={`badge-status ${statusClass}`}>{cust.status}</span>
                          </td>
                        </tr>
                      );
                    })
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
