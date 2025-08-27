
import React, { useEffect, useState } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, UserMinus, DollarSign, Calendar, AlertTriangle, Phone, Star } from "lucide-react";
import "../../assets/css/main.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    churnRate: 0,
    avgRevenue: 0,
    avgTenure: 0,
    highRiskCustomers: 0,
    upsellCandidates: 0,
    openTickets: 0,
    avgSatisfaction: 0
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simulate API call (replace with Axios call to /api when backend ready)
    import("../api/churnApi").then(() => {
      // Mocked data, replace with real API call
      setStats({
        totalCustomers: 1240,
        churnRate: 27.1,
        avgRevenue: 58.23,
        avgTenure: 18,
        highRiskCustomers: 42,
        upsellCandidates: 87,
        openTickets: 5,
        avgSatisfaction: 4.2
      });
      setActivities([
        { icon: <Users size={20} />, title: "New customer onboarded", description: "2 hours ago" },
        { icon: <AlertTriangle size={20} />, title: "High churn risk detected", description: "4 hours ago" },
        { icon: <TrendingUp size={20} />, title: "Upsell opportunity identified", description: "6 hours ago" },
        { icon: <Phone size={20} />, title: "Support ticket resolved", description: "8 hours ago" },
        { icon: <Star size={20} />, title: "5-star customer review", description: "1 day ago" }
      ]);
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
              <div className="stat-icon green"><DollarSign /></div>
              <div className="stat-content">
                <h3>${stats.avgRevenue}</h3>
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
              {/* Chart placeholder - replace with Chart component */}
              <div style={{height: 220, background: '#f9fafb', borderRadius: 8}}></div>
            </div>
            <div className="chart-card">
              <h3>Customer Segments</h3>
              {/* Chart placeholder - replace with Chart component */}
              <div style={{height: 220, background: '#f9fafb', borderRadius: 8}}></div>
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
