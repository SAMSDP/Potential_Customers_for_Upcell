import React, { useEffect, useState } from "react";
import {
  Home,
  TrendingUp,
  BarChart3,
  Brain,
  Users,
  Target,
  UserMinus,
  Calendar,
  AlertTriangle,
  Phone,
  Star,
  IndianRupee,
} from "lucide-react";
import "../../assets/css/main.css";
import { API_BASE_URL } from "../config/api";

import { Chart as ChartJS } from "chart.js/auto"; // ✅ auto-registers all chart types & plugins
import { Chart } from "react-chartjs-2"; // ✅ wrapper from react-chartjs-2

console.log("API Base URL:", API_BASE_URL);

// -------- API calls --------
const fetchSummaryMetrics = async () => {
  const response = await fetch("https://actual-hamster-renewing.ngrok-free.app/dashboard/summary-metrics", {credentials: 'include',
});
  return await response.json();
};

const fetchChurnTrend = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/churn-trend/`, {credentials: 'include',
});
  return await response.json();
};

const fetchQuickInsights = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/quick-insights/`);
  return await response.json();
};

const fetchCustomerSegments = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/customer-segments/`);
  return await response.json();
};

const Dashboard = () => {
  const [churnChartData, setChurnChartData] = useState(null);
  const [customerSegmentsData, setCustomerSegmentsData] = useState(null);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    churnRate: 0,
    avgRevenue: 0,
    avgTenure: 0,
    highRiskCustomers: 0,
    upsellCandidates: 0,
    openTickets: 0,
    avgSatisfaction: 0,
  });

  const [insights, setInsights] = useState({
    highRiskCustomers: 0,
    upsellCandidates: 0,
    openTickets: 0,
    avgSatisfaction: 0,
  });

  // -------- Load Data --------
  useEffect(() => {
    const loadData = async () => {
      try {
        const summaryData = await fetchSummaryMetrics();
        const churnTrendData = await fetchChurnTrend();
        const quickInsightsData = await fetchQuickInsights();
        const customerSegmentsData = await fetchCustomerSegments();

        console.log("Summary Data:", summaryData);
        console.log("Churn Trend Data:", churnTrendData);
        console.log("Quick Insights Data:", quickInsightsData);
        console.log("Customer Segments Data:", customerSegmentsData);

        // Stats
        setStats({
          totalCustomers: summaryData.totalCustomers,
          churnRate: summaryData.churnRate,
          avgRevenue: summaryData.avgRevenue,
          avgTenure: summaryData.avgTenure,
          highRiskCustomers: quickInsightsData.highChurnRisk,
          upsellCandidates: quickInsightsData.upsellOpportunities,
          openTickets: quickInsightsData.openTickets || 0,
          avgSatisfaction: quickInsightsData.satisfactionScore,
        });

        // Churn chart
        if (churnTrendData && churnTrendData.labels && churnTrendData.datasets?.[0]) {
          setChurnChartData({
            labels: churnTrendData.labels,
            datasets: [
              {
                label: churnTrendData.datasets[0].label,
                data: churnTrendData.datasets[0].data,
                fill: false,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.2)",
                tension: 0.4,
              },
            ],
          });
        }

        // Quick insights
        setInsights({
          highRiskCustomers: quickInsightsData.highChurnRisk,
          upsellCandidates: quickInsightsData.upsellOpportunities,
          openTickets: quickInsightsData.openTickets || 0,
          avgSatisfaction: quickInsightsData.satisfactionScore,
        });

        // Customer segments (Pie chart dataset)
        setCustomerSegmentsData({
          labels: ["Loyal", "At Risk", "Neutral"],
          datasets: [
            {
              data: [
                customerSegmentsData.loyal || 0,
                customerSegmentsData.atRisk || 0,
                customerSegmentsData.neutral || 0,
              ],
              backgroundColor: ["#4CAF50", "#F44336", "#FFC107"], // green, red, yellow
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="dashboard-page">
      {/* -------- Sidebar -------- */}
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
        <ul className="nav-menu">
          <li>
            <a href="/" className="nav-link active" data-page="dashboard">
              <Home size={18} />Dashboard
            </a>
          </li>
          <li>
            <a href="/analytics" className="nav-link" data-page="analytics">
              <BarChart3 size={18} />Analytics
            </a>
          </li>
          <li>
            <a href="/prediction" className="nav-link" data-page="prediction">
              <Brain size={18} />Predictions
            </a>
          </li>
          <li>
            <a href="/segments" className="nav-link" data-page="segments">
              <Users size={18} />Segments
            </a>
          </li>
          <li>
            <a href="/recommendations" className="nav-link" data-page="recommendations">
              <Target size={18} />Recommendations
            </a>
          </li>
        </ul>
      </nav>

      {/* -------- Main Content -------- */}
      <main className="main-content">
        <header className="page-header">
          <h1>Executive Dashboard</h1>
          <p>High-level insights and KPIs for strategic decision making</p>
        </header>

        <div className="dashboard-grid">
          {/* ---- Stats Row ---- */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Users />
              </div>
              <div className="stat-content">
                <h3>{stats.totalCustomers.toLocaleString()}</h3>
                <p>Total Customers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">
                <UserMinus />
              </div>
              <div className="stat-content">
                <h3>{stats.churnRate}%</h3>
                <p>Churn Rate</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <IndianRupee />
              </div>
              <div className="stat-content">
                <h3>₹{stats.avgRevenue.toLocaleString("en-IN")}</h3>
                <p>Avg Monthly Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <Calendar />
              </div>
              <div className="stat-content">
                <h3>{stats.avgTenure}</h3>
                <p>Avg Tenure (months)</p>
              </div>
            </div>
          </div>

          {/* ---- Charts Row ---- */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>Churn Rate Trend</h3>
              {churnChartData ? (
                <Chart
                  type="line"
                  data={churnChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false }, title: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100 } },
                  }}
                  height={220}
                />
              ) : (
                <div>Loading Churn Rate Data...</div>
              )}
            </div>

            <div className="chart-card">
              <h3>Customer Segments</h3>
              {customerSegmentsData ? (
                <Chart
                  type="pie"
                  data={customerSegmentsData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                    },
                  }}
                  height={220}
                />
              ) : (
                <div>Loading Customer Segments...</div>
              )}
            </div>
          </div>

          {/* ---- Quick Insights ---- */}
          <div className="insights-row">
            <div className="insight-card">
              <h3>Quick Insights</h3>
              <div className="insights-grid">
                <div className="insight-item">
                  <AlertTriangle />
                  <div>
                    <h4>High Churn Risk</h4>
                    <p>{insights.highRiskCustomers} customers need attention</p>
                  </div>
                </div>
                <div className="insight-item">
                  <TrendingUp />
                  <div>
                    <h4>Upsell Opportunities</h4>
                    <p>{insights.upsellCandidates} customers ready for premium</p>
                  </div>
                </div>
                <div className="insight-item">
                  <Phone />
                  <div>
                    <h4>Support Tickets</h4>
                    <p>{insights.openTickets} open tickets this week</p>
                  </div>
                </div>
                <div className="insight-item">
                  <Star />
                  <div>
                    <h4>Satisfaction Score</h4>
                    <p>{insights.avgSatisfaction}/5 average rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
