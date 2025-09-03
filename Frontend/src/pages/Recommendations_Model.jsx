import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Crown, Shield, RefreshCw, FileText, Send, TrendingUp as TrendingUpIcon } from "lucide-react";
import "../../assets/css/main.css";

const RecommendationsModel = () => {
  const location = useLocation();
  const { apiResponse } = location.state || {};
  
  // State
  const [summary, setSummary] = useState({
    loyal: 0,
    atRisk: 0,
    neutral: 0,
    conversionRate: "0%",
    retentionRate: "0%",
    engagementRate: "0%",
  });
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [segment, setSegment] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Process data from API response
  useEffect(() => {
    if (!apiResponse || apiResponse.length === 0) return;

    // Transform API response to match the expected format
    const transformedData = apiResponse.map(customer => {
      // Calculate churn probability (ensure it's a number between 0-100)
      const churnProbability = parseFloat(customer.churnProbability) || 0;
      
      // Determine customer segment based on churn probability
      let customerSegment = "neutral";
      if (churnProbability < 30) customerSegment = "loyal";
      else if (churnProbability > 70) customerSegment = "at-risk";
      
      // Determine opportunity type based on business action
      let opportunity = "Engagement Opportunity";
      if (customer.businessAction === "Upsell Offer") opportunity = "Upsell Opportunity";
      else if (customer.businessAction === "Retention Offer") opportunity = "Retention Opportunity";
      
      // Determine priority based on churn probability
      let priorityLevel = "medium";
      if (churnProbability < 20) priorityLevel = "high";
      else if (churnProbability > 50) priorityLevel = "low";
      
      // Calculate potential revenue based on usage category and tenure
      const baseRevenue = {
        "Low": 500,
        "Medium": 1200,
        "High": 2500
      };
      
      const tenureBonus = Math.min(customer.tenure * 50, 1500);
      const potentialRevenue = baseRevenue[customer.usageCategory] + tenureBonus;
      
      // Calculate acceptance score (inverse of churn probability)
      const acceptanceScore = 100 - churnProbability;
      
      return {
        phone_number: customer.phoneNumber,
        customer_segment: customerSegment,
        opportunity: opportunity,
        churn_probability: churnProbability,
        revenue: potentialRevenue,
        type: opportunity.toLowerCase().replace(" opportunity", ""),
        priority: priorityLevel,
        acceptance_score: acceptanceScore
      };
    });

    // Calculate summary statistics
    const loyalCount = transformedData.filter(r => r.customer_segment === "loyal").length;
    const atRiskCount = transformedData.filter(r => r.customer_segment === "at-risk").length;
    const neutralCount = transformedData.filter(r => r.customer_segment === "neutral").length;
    const totalCount = transformedData.length;
    
    // Calculate average acceptance scores for each segment
    const loyalAvgScore = loyalCount > 0 
      ? transformedData.filter(r => r.customer_segment === "loyal")
          .reduce((sum, r) => sum + r.acceptance_score, 0) / loyalCount
      : 0;
          
    const atRiskAvgScore = atRiskCount > 0 
      ? transformedData.filter(r => r.customer_segment === "at-risk")
          .reduce((sum, r) => sum + r.acceptance_score, 0) / atRiskCount
      : 0;
          
    const neutralAvgScore = neutralCount > 0 
      ? transformedData.filter(r => r.customer_segment === "neutral")
          .reduce((sum, r) => sum + r.acceptance_score, 0) / neutralCount
      : 0;

    setSummary({
      loyal: loyalCount,
      atRisk: atRiskCount,
      neutral: neutralCount,
      conversionRate: `${Math.round(loyalAvgScore)}%`,
      retentionRate: `${Math.round(atRiskAvgScore)}%`,
      engagementRate: `${Math.round(neutralAvgScore)}%`,
    });

    setAllRecommendations(transformedData);
    setRecommendations(transformedData);
  }, [apiResponse]);

  // Reset to first page when filters change
  useEffect(() => {
    applyFilters();
  }, [segment, priority, type, allRecommendations]);

  // Apply frontend filters
  const applyFilters = () => {
    let filtered = allRecommendations;
    if (segment) filtered = filtered.filter(r => r.customer_segment.toLowerCase() === segment);
    if (type) filtered = filtered.filter(r => r.type === type);
    if (priority) filtered = filtered.filter(r => r.priority === priority);
    setRecommendations(filtered);
    setCurrentPage(1);
  };

  const generateRecommendations = () => {
    // Optionally refetch or regenerate
    applyFilters();
  };

  const exportRecommendations = format => {
    // Implement export logic if needed
    console.log(`Export ${format}`);
  };

  const sendToSalesTeam = () => {
    // Implement sending logic
    console.log("Sent to Sales Team");
  };

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
          {/* Summary Cards */}
          <div className="strategy-overview">
            <div className="strategy-card loyal">
              <div className="strategy-header"><Crown size={24} /><h3>Loyal Customers</h3></div>
              <div className="strategy-content">
                <p>Premium upsell opportunities and exclusive offers</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">{summary.loyal}</span><span className="stat-label">Recommendations</span></div>
                  <div className="stat"><span className="stat-value">{summary.conversionRate}</span><span className="stat-label">Conversion Rate</span></div>
                </div>
              </div>
            </div>
            <div className="strategy-card at-risk">
              <div className="strategy-header"><Shield size={24} /><h3>At-Risk Customers</h3></div>
              <div className="strategy-content">
                <p>Retention offers and service improvement plans</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">{summary.atRisk}</span><span className="stat-label">Recommendations</span></div>
                  <div className="stat"><span className="stat-value">{summary.retentionRate}</span><span className="stat-label">Retention Rate</span></div>
                </div>
              </div>
            </div>
            <div className="strategy-card neutral">
              <div className="strategy-header"><TrendingUpIcon size={24} /><h3>Neutral Customers</h3></div>
              <div className="strategy-content">
                <p>Engagement campaigns and service discovery</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">{summary.neutral}</span><span className="stat-label">Recommendations</span></div>
                  <div className="stat"><span className="stat-value">{summary.engagementRate}</span><span className="stat-label">Engagement Rate</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
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

          {/* Recommendations Grid */}
          <div className="recommendations-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            margin: '2rem 0'
          }}>
            {(() => {
              const startIdx = (currentPage - 1) * pageSize;
              const endIdx = startIdx + pageSize;
              const paginatedRecommendations = recommendations.slice(startIdx, endIdx);
              if (paginatedRecommendations.length === 0) {
                return <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#888'}}>No recommendations</div>;
              }
              return paginatedRecommendations.map((rec, idx) => (
                <div key={`${rec.phone_number}_${startIdx + idx}`} style={{
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 220,
                  position: 'relative'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
                    <div style={{background: '#2563eb', color: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, marginRight: 12}}>
                      {startIdx + idx + 1}
                    </div>
                    <div>
                      <div style={{fontWeight: 600, fontSize: 18}}>Customer {rec.phone_number.replace(/\D/g, '')}</div>
                      <div style={{fontSize: 14, color: '#888'}}>{rec.phone_number}</div>
                    </div>
                    <div style={{marginLeft: 'auto'}}>
                      {(() => {
                        let color = '#fff1b9ff', text = 'rgba(255, 192, 3, 1)', label = 'Medium';
                        if (rec.priority === 'high') { color = '#fee2e2'; text = '#dc2626'; label = 'High'; }
                        else if (rec.priority === 'low') { color = '#d1fae5'; text = '#059669'; label = 'Low'; }
                        return (
                          <span style={{background: color, color: text, borderRadius: 8, padding: '2px 12px', fontSize: 14, fontWeight: 500, boxShadow: `0 0 0 2px ${color}`}}>{label}</span>
                        );
                      })()}
                    </div>
                  </div>
                  <div style={{margin: '8px 0'}}>
                    <span style={{background: '#f3f4f6', color: '#374151', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 500}}>
                      {rec.opportunity}
                    </span>
                  </div>
                  <div style={{marginBottom: 16, color: '#444', fontSize: 15}}>
                    {rec.type === 'retention' && 'Immediate retention offer with 20% discount and dedicated support. Address service concerns proactively.'}
                    {rec.type === 'engagement' && 'Introduce mid-tier service upgrades and personalized usage insights to increase engagement.'}
                    {rec.type === 'upsell' && 'Offer premium plan upgrades and exclusive features to loyal customers.'}
                  </div>
                  <div style={{display: 'flex', gap: '2rem'}}>
                    <div style={{background: '#f9fafb', borderRadius: 12, padding: '1rem', flex: 1, textAlign: 'center'}}>
                      <div style={{fontWeight: 700, fontSize: 22}}>
                        {rec.acceptance_score !== undefined ? `${Math.round(rec.acceptance_score)}%` : '—'}
                      </div>
                      <div style={{fontSize: 13, color: '#888'}}>Acceptance Score</div>
                    </div>
                    <div style={{background: '#f9fafb', borderRadius: 12, padding: '1rem', flex: 1, textAlign: 'center'}}>
                      <div style={{fontWeight: 700, fontSize: 22}}>
                        {rec.revenue !== undefined ? `₹${Math.round(rec.revenue).toLocaleString('en-IN')}` : '₹—'}
                      </div>
                      <div style={{fontSize: 13, color: '#888'}}>Potential Revenue</div>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Pagination */}
          {recommendations.length > pageSize && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, margin: '2rem 0'}}>
              <button className="btn btn-secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
              <span style={{fontWeight: 500, fontSize: 16}}>Page {currentPage} of {Math.ceil(recommendations.length / pageSize)}</span>
              <button className="btn btn-secondary" onClick={() => setCurrentPage(p => Math.min(Math.ceil(recommendations.length / pageSize), p + 1))} disabled={currentPage === Math.ceil(recommendations.length / pageSize)}>Next</button>
            </div>
          )}

          {/* Export Section */}
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

export default RecommendationsModel;