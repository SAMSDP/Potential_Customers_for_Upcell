import React, { useEffect, useState } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, UserMinus, DollarSign, Calendar, AlertTriangle, Phone, Star, Contact2Icon, ContactIcon, Contact, LucideContact, FileWarningIcon, LucideMessageSquareWarning, RadioTower, ArrowBigRightDash, ArrowDownRightFromSquare, ArrowUpRightFromSquareIcon, IndianRupee } from "lucide-react";
import "../../assets/css/main.css";


import Chart from "../components/Chart";
import { getCdr } from "../api/cdrApi";
import { getSupport } from "../api/supportApi";
import { getTelco } from "../api/churnApi";
import telco from "../database/telco.js";

const Dashboard = () => {
  const [churnChartData, setChurnChartData] = useState(null);
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

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch data from local API functions
    const cdrData = getCdr();
    const supportData = getSupport();
    const telcoData = getTelco();

    setStats({
      totalCustomers: telcoData.totalCustomers,
      churnRate: telcoData.churnRate,
      avgRevenue: telcoData.avgRevenue,
      avgTenure: telcoData.avgTenure,
      highRiskCustomers: telcoData.highRiskCustomers,
      upsellCandidates: cdrData.upsellCandidates,
      openTickets: supportData.openTickets,
      avgSatisfaction: supportData.avgSatisfaction,
    });

    setActivities([
      { icon: <Users size={20} />, title: "New customer onboarded", description: "2 hours ago" },
      { icon: <AlertTriangle size={20} />, title: "High churn risk detected", description: "4 hours ago" },
      { icon: <TrendingUp size={20} />, title: "Upsell opportunity identified", description: "6 hours ago" },
      { icon: <Phone size={20} />, title: "Support ticket resolved", description: "8 hours ago" },
      { icon: <Star size={20} />, title: "5-star customer review", description: "1 day ago" }
    ]);

    // Aggregate churn count by month from telco.js
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const churnCounts = Array(12).fill(0);
    telco.data.forEach((cust, i) => {
      if (cust.churn === "Yes") {
        // Randomly assign churn month for demo
        const m = i % 12;
        churnCounts[m]++;
      }
    });
    setChurnChartData({
      labels: months,
      datasets: [
        {
          label: "Churned Customers",
          data: churnCounts,
          fill: true,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "#3b82f6",
          pointRadius: 5,
          tension: 0.4,
        },
      ],
    });
  }, []);

  return (
    <div className="dashboard-page">
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
        <ul className="nav-menu">
          <li><a href="/" className="nav-link active" data-page="dashboard"><Home size={18} />Dashboard</a></li>
          <li><a href="/analytics" className="nav-link" data-page="analytics"><BarChart3 size={18} />Analytics</a></li>
          <li><a href="/prediction" className="nav-link" data-page="prediction"><Brain size={18} />Predictions</a></li>
          <li><a href="/segments" className="nav-link" data-page="segments"><Users size={18} />Segments</a></li>
          <li><a href="/recommendations" className="nav-link" data-page="recommendations"><Target size={18} />Recommendations</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>Executive Dashboard</h1>
          <p>High-level insights and KPIs for strategic decision making</p>
        </header>

        <div className="dashboard-grid">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon blue"><Users /></div>
              <div className="stat-content">
                <h3>{stats.totalCustomers.toLocaleString()}</h3>
                <p>Total Customers</p>
                <span className="trend positive">+5.2% vs last month</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><UserMinus /></div>
              <div className="stat-content">
                <h3>{stats.churnRate}%</h3>
                <p>Churn Rate</p>
                <span className="trend negative">+1.3% vs last month</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><IndianRupee/></div>
              <div className="stat-content">
                <h3>₹{stats.avgRevenue.toLocaleString("en-IN")}</h3>
                <p>Avg Monthly Revenue</p>
                <span className="trend positive">+8.1% vs last month</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><Calendar /></div>
              <div className="stat-content">
                <h3>{stats.avgTenure}</h3>
                <p>Avg Tenure (months)</p>
                <span className="trend neutral">+0.2% vs last month</span>
              </div>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>Churn Rate Trend</h3>
              <Chart
                type="line"
                data={(() => {
                  // Calculate churn rate by month from telco.js
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const churnCounts = Array(12).fill(0);
                  const totalCounts = Array(12).fill(0);
                  telco.data.forEach((cust, i) => {
                    const m = i % 12;
                    totalCounts[m]++;
                    if (cust.churn === "Yes") churnCounts[m]++;
                  });
                  const churnRates = churnCounts.map((c, i) => totalCounts[i] ? (c / totalCounts[i]) * 100 : 0);
                  return {
                    labels: months,
                    datasets: [
                      {
                        label: "Churn Rate %",
                        data: churnRates,
                        fill: false,
                        borderColor: "#ef4444",
                        tension: 0.4,
                      },
                    ],
                  };
                })()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, max: 100 },
                  },
                }}
                height={220}
              />
            </div>
            <div className="chart-card">
              <h3>Customer Segments</h3>
              <div style={{ height: 220, background: '#f9fafb', borderRadius: 8 }}></div>
            </div>
          </div>

          <div className="insights-row">
            <div className="insight-card">
              <h3>Quick Insights</h3>
              <div className="insights-grid">
                <div className="insight-item">
                  <AlertTriangle />
                  <div>
                    <h4>High Churn Risk</h4>
                    <p>{stats.highRiskCustomers} customers need attention</p>
                  </div>
                </div>
                <div className="insight-item">
                  <TrendingUp />
                  <div>
                    <h4>Upsell Opportunities</h4>
                    <p>{stats.upsellCandidates} customers ready for premium</p>
                  </div>
                </div>
                <div className="insight-item">
                  <Phone />
                  <div>
                    <h4>Support Tickets</h4>
                    <p>{stats.openTickets} open tickets this week</p>
                  </div>
                </div>
                <div className="insight-item">
                  <Star />
                  <div>
                    <h4>Satisfaction Score</h4>
                    <p>{stats.avgSatisfaction}/5 average rating</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {activities.map((activity, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <h5>{activity.title}</h5>
                      <p>{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
