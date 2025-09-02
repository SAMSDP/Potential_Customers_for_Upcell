import React, { useState, useEffect } from "react";
import Chart from "../components/Chart";
import {
  Home,
  TrendingUp,
  BarChart3,
  Brain,
  Users,
  Target,
  Filter,
  Download,
} from "lucide-react";
import "../../assets/css/main.css";
import { API_BASE_URL } from "../config/api";

const Analytics = () => {
  const [tenure, setTenure] = useState("");
  const [contract, setContract] = useState("");
  const [service, setService] = useState("");

  const [allCustomers, setAllCustomers] = useState([]); // full dataset
  const [customers, setCustomers] = useState([]); // filtered dataset

  const [callUsageData, setCallUsageData] = useState(null);
  const [churnDistributionData, setChurnDistributionData] = useState(null);
  const [supportMetricsData, setSupportMetricsData] = useState(null);
  const [revenueDistributionData, setRevenueDistributionData] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ---- Filters handler (frontend filtering) ----
  const applyFilters = () => {
    let filtered = [...allCustomers];

    if (tenure) {
      if (tenure === "new") {
        filtered = filtered.filter((c) => parseInt(c.tenure) <= 12);
      } else if (tenure === "old") {
        filtered = filtered.filter((c) => parseInt(c.tenure) > 24);
      }
    }

    if (contract) {
      filtered = filtered.filter((c) =>
        contract === "month"
          ? c.contract?.toLowerCase().includes("month")
          : c.contract?.toLowerCase().includes("year")
      );
    }

    if (service) {
      if (service === "no") {
        filtered = filtered.filter(
          (c) =>
            c.internetservice?.toLowerCase() === "no" ||
            c.internetservice?.toLowerCase() === "none"
        );
      } else {
        filtered = filtered.filter(
          (c) => c.internetservice?.toLowerCase() === service
        );
      }
    }

    setCustomers(filtered);
    setCurrentPage(1); // reset to page 1 after filters
  };

  // ---- Export handler ----
  const exportCustomerData = () => {
    const blob = new Blob([JSON.stringify(customers, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customers.json";
    link.click();
  };

  // ---- Fetch on mount ----
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call Usage
        const usageRes = await fetch(
          `${API_BASE_URL}/analytics/usage-vs-customers/`
        );
        const usage = await usageRes.json();
        setCallUsageData(usage);

        // Customers by Contract
        const churnRes = await fetch(
          `${API_BASE_URL}/analytics/customers-by-contract/`
        );
        const churn = await churnRes.json();
        setChurnDistributionData(churn);

        // Payment Methods
        const supportRes = await fetch(
          `${API_BASE_URL}/analytics/payment-methods/`
        );
        const support = await supportRes.json();
        setSupportMetricsData(support);

        // Revenue Distribution
        const revRes = await fetch(
          `${API_BASE_URL}/analytics/revenue-distribution/`
        );
        const revenue = await revRes.json();
        setRevenueDistributionData(revenue);

        // Customer Details
        const custRes = await fetch(
          `${API_BASE_URL}/analytics/customer-details/`
        );
        const custData = await custRes.json();
        setAllCustomers(custData.customers || []);
        setCustomers(custData.customers || []);
      } catch (err) {
        console.error("Error loading analytics data:", err);
      }
    };

    fetchData();
  }, []);

  // ---- Pagination logic ----
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  // ---- Custom chart colors ----
  const chartColors = [
    getComputedStyle(document.documentElement).getPropertyValue("--primary") ||
      "#2563eb",
    getComputedStyle(document.documentElement).getPropertyValue("--secondary") ||
      "#10b981",
    getComputedStyle(document.documentElement).getPropertyValue("--accent") ||
      "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <div className="analytics-page">
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
            <a
              href="/analytics"
              className="nav-link active"
              data-page="analytics"
            >
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
            <a href="/segments" className="nav-link" data-page="segments">
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

      {/* Main */}
      <main className="main-content">
        <header className="page-header">
          <h1>Customer Analytics</h1>
          <p>Deep dive into customer behavior patterns and trends</p>
        </header>

        <div className="analytics-grid">
          {/* Charts Row 1 */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>Call Usage Analysis</h3>
              {callUsageData ? (
                <Chart
                  type="bar"
                  data={{
                    ...callUsageData,
                    datasets: callUsageData.datasets.map((ds, i) => ({
                      ...ds,
                      backgroundColor: chartColors[i % chartColors.length],
                    })),
                  }}
                  options={{
                    indexAxis: "x",
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
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
                  data={{
                    ...churnDistributionData,
                    datasets: churnDistributionData.datasets.map((ds, i) => ({
                      ...ds,
                      backgroundColor: chartColors[i % chartColors.length],
                    })),
                  }}
                  options={{
                    indexAxis: "x",
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

          {/* Charts Row 2 */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>Customer Support Metrics</h3>
              {supportMetricsData ? (
                <Chart
                  type="doughnut"
                  data={{
                    ...supportMetricsData,
                    datasets: supportMetricsData.datasets.map((ds) => ({
                      ...ds,
                      backgroundColor: chartColors,
                    })),
                  }}
                  options={{
                    plugins: { legend: { display: true, position: "bottom" } },
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
                  data={{
                    ...revenueDistributionData,
                    datasets: revenueDistributionData.datasets.map((ds, i) => ({
                      ...ds,
                      backgroundColor: chartColors[i % chartColors.length],
                    })),
                  }}
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

          {/* Filters */}
          <div
            className="filters-section"
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: 16,
              marginBottom: "2rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Filters</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Tenure</label>
                <select
                  className="form-select"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                >
                  <option value="">All Customers</option>
                  <option value="new">New (≤ 12 months)</option>
                  <option value="old">Experienced (&gt; 24 months)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Contract Type</label>
                <select
                  className="form-select"
                  value={contract}
                  onChange={(e) => setContract(e.target.value)}
                >
                  <option value="">All Contracts</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  className="form-select"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">All Services</option>
                  <option value="fiber">Fiber Optic</option>
                  <option value="dsl">DSL</option>
                  <option value="no">No Internet</option>
                </select>
              </div>
              <div
                className="form-group"
                style={{ display: "flex", alignItems: "end" }}
              >
                <button className="btn btn-primary" onClick={applyFilters}>
                  <Filter size={16} style={{ marginRight: 4 }} />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-section">
            <div className="table-container">
              <div
                style={{
                  padding: "1.5rem",
                  borderBottom: "1px solid var(--gray-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>Customer Details</h3>
                <button
                  className="btn btn-secondary"
                  onClick={exportCustomerData}
                >
                  <Download size={16} style={{ marginRight: 4 }} />
                  Export Data
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Tenure</th>
                    <th>Contract</th>
                    <th>Monthly Charges</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", color: "#888" }}
                      >
                        No data
                      </td>
                    </tr>
                  ) : (
                    currentCustomers.map((cust, idx) => (
                      <tr key={cust.customerid + idx}>
                        <td>{cust.customerid}</td>
                        <td>{cust.tenure}</td>
                        <td>{cust.contract}</td>
                        <td>
                          ₹{parseFloat(cust.monthlycharges).toLocaleString()}
                        </td>
                        <td>{cust.gender}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                  <span style={{ alignSelf: "center" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
