// RecommendationModel.jsx (Updated field mapping section)
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, Crown, Shield, RefreshCw, FileText, Send, TrendingUp as TrendingUpIcon } from "lucide-react";
import "../../assets/css/main.css";

const RecommendationModel = () => {
  const location = useLocation();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for processed data
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

  // Process data from API response (replicating Django view logic)
  useEffect(() => {
    if (location.state && location.state.apiResponse) {
      try {
        const finalOutData = location.state.apiResponse;
        console.log("Raw API Data:", finalOutData); // Debug log
        
        // Replicate segment_counts logic
        const processSummaryData = (data) => {
          if (data.length === 0) return { loyal: { count: 0, percentage: 0 }, neutral: { count: 0, percentage: 0 }, at_risk: { count: 0, percentage: 0 } };
          
          // Calculate average churn probability
          const totalChurn = data.reduce((sum, item) => sum + (item.Churn_Probability || 0), 0);
          const avgChurn = totalChurn / data.length;
          console.log("Average Churn:", avgChurn); // Debug log
          
          // Segment customers (replicating Django logic exactly)
          const loyalCustomers = data.filter(item => (item.Churn_Probability || 0) < avgChurn);
          const neutralCustomers = data.filter(item => 
            (item.Churn_Probability || 0) >= avgChurn * 0.95 && 
            (item.Churn_Probability || 0) <= avgChurn * 1.05
          );
          const atRiskCustomers = data.filter(item => (item.Churn_Probability || 0) > avgChurn);
          
          const totalCustomers = data.length;
          
          const segmentSummary = (segmentData) => ({
            count: segmentData.length,
            percentage: totalCustomers > 0 ? Math.round((segmentData.length / totalCustomers) * 100) : 0
          });
          
          return {
            loyal: segmentSummary(loyalCustomers),
            neutral: segmentSummary(neutralCustomers),
            at_risk: segmentSummary(atRiskCustomers),
            avg_churn_probability: avgChurn
          };
        };

        // Replicate customer_details logic
        const processCustomerDetails = (data) => {
          if (data.length === 0) return [];
          
          // Calculate average churn for segmentation
          const totalChurn = data.reduce((sum, item) => sum + (item.Churn_Probability || 0), 0);
          const avgChurn = totalChurn / data.length;
          
          return data.map(cust => {
            // Determine segment (exact Django logic)
            let segment, opportunity;
            if ((cust.Churn_Probability || 0) < avgChurn) {
              segment = 'Loyal';
              opportunity = 'Upcell Opportunity';
            } else if ((cust.Churn_Probability || 0) > avgChurn) {
              segment = 'At-Risk';
              opportunity = 'Retention Opportunity';
            } else {
              segment = 'Neutral';
              opportunity = 'Engagement Opportunity';
            }
            
            // Map usage category (exact Django logic)
            const usageMap = {0: 'Low', 1: 'Medium', 2: 'High'};
            const usage = usageMap[cust.Usage_Category] || 'Unknown';
            
            // Compute revenue (using correct field names from JSON)
            const revenue = (cust.Day_Charge || 0) + (cust.Eve_Charge || 0) + 
                           (cust.Night_Charge || 0) + (cust.Intl_Charge || 0);
            
            // Determine priority based on churn probability percentage
            const churnPercent = (cust.Churn_Probability || 0) * 100;
            const priority = churnPercent < 20 ? 'high' :
                            churnPercent <= 50 ? 'medium' : 'low';
            
            // Map to type for filtering
            const type = opportunity === 'Upcell Opportunity' ? 'upsell' :
                        opportunity === 'Retention Opportunity' ? 'retention' :
                        opportunity === 'Engagement Opportunity' ? 'engagement' : '';
            
            const recommendation = {
              phone_number: cust['Phone Number'] || 'N/A',
              usage_category: usage,
              customer_segment: segment,
              opportunity: opportunity,
              recommended_products: Array.isArray(cust.Recommended_Products) 
                ? cust.Recommended_Products.join(', ') 
                : cust.Recommended_Products || '',
              churn_probability: Math.round((cust.Churn_Probability || 0) * 100 * 100) / 100,
              revenue: Math.round(revenue * 100) / 100,
              priority: priority,
              type: type
            };
            
            console.log("Processed Recommendation:", recommendation); // Debug log
            return recommendation;
          });
        };

        // Process the data
        const summaryData = processSummaryData(finalOutData);
        const customerDetails = processCustomerDetails(finalOutData);
        
        console.log("Summary Data:", summaryData); // Debug log
        console.log("Customer Details:", customerDetails); // Debug log
        
        // Set summary state
        setSummary({
          loyal: summaryData.loyal.count,
          atRisk: summaryData.at_risk.count,
          neutral: summaryData.neutral.count,
          conversionRate: summaryData.loyal.percentage + "%",
          retentionRate: summaryData.at_risk.percentage + "%",
          engagementRate: summaryData.neutral.percentage + "%",
        });
        
        // Set recommendations
        setAllRecommendations(customerDetails);
        setRecommendations(customerDetails);
        setApiData(finalOutData);
        setLoading(false);
        
      } catch (err) {
        setError('Failed to process recommendation data: ' + err.message);
        setLoading(false);
        console.error('Error processing data:', err);
      }
    } else {
      setError('No recommendation data found. Please go back and generate recommendations first.');
      setLoading(false);
    }
  }, [location.state]);

  // Reset to first page when filters change
  useEffect(() => {
    applyFilters();
  }, [segment, priority, type, allRecommendations]);

  // Apply frontend filters
  const applyFilters = () => {
    let filtered = allRecommendations;
    if (segment) filtered = filtered.filter(r => r.customer_segment.toLowerCase().replace('-', '') === segment.toLowerCase().replace('-', ''));
    if (type) filtered = filtered.filter(r => r.type === type);
    if (priority) filtered = filtered.filter(r => r.priority === priority);
    setRecommendations(filtered);
    setCurrentPage(1);
  };

  const generateRecommendations = () => {
    // Refresh the data processing
    applyFilters();
  };

  const exportRecommendations = format => {
    console.log(`Export ${format} for ${recommendations.length} recommendations`);
    // Implement export logic here
  };

  const sendToSalesTeam = () => {
    console.log("Sent to Sales Team");
    // Implement sending logic here
  };

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading-container">
          <div className="loading">Processing recommendations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <div className="error-container">
          <div className="error">{error}</div>
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
          <li><a href="/recommendations" className="nav-link" data-page="recommendations"><Target size={18} />Recommendations</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>AI Recommendations (From Model)</h1>
          <p>Processed from final_out table data - {apiData.length} records analyzed</p>
        </header>

        <div className="recommendations-dashboard">
          {/* Summary Cards - FIXED DISPLAY */}
          <div className="strategy-overview">
            <div className="strategy-card loyal">
              <div className="strategy-header"><Crown size={24} /><h3>Loyal Customers</h3></div>
              <div className="strategy-content">
                <p>Premium upsell opportunities and exclusive offers</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">{summary.loyal}</span><span className="stat-label">Customers</span></div>
                  <div className="stat"><span className="stat-value">{summary.conversionRate}</span><span className="stat-label">Of Total</span></div>
                </div>
              </div>
            </div>
            <div className="strategy-card at-risk">
              <div className="strategy-header"><Shield size={24} /><h3>At-Risk Customers</h3></div>
              <div className="strategy-content">
                <p>Retention offers and service improvement plans</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">{summary.atRisk}</span><span className="stat-label">Customers</span></div>
                  <div className="stat"><span className="stat-value">{summary.retentionRate}</span><span className="stat-label">Of Total</span></div>
                </div>
              </div>
            </div>
            <div className="strategy-card neutral">
              <div className="strategy-header"><TrendingUpIcon size={24} /><h3>Neutral Customers</h3></div>
              <div className="strategy-content">
                <p>Engagement campaigns and service discovery</p>
                <div className="strategy-stats">
                  <div className="stat"><span className="stat-value">{summary.neutral}</span><span className="stat-label">Customers</span></div>
                  <div className="stat"><span className="stat-value">{summary.engagementRate}</span><span className="stat-label">Of Total</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section" style={{background: 'white', padding: '1.5rem', borderRadius: 16, margin: '2rem 0', boxShadow: 'var(--shadow-md)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3>Filter Recommendations</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <span style={{fontSize: '14px', color: '#666'}}>
                  Showing {recommendations.length} of {allRecommendations.length} recommendations
                </span>
                <button className="btn btn-primary" onClick={generateRecommendations}>
                  <RefreshCw size={16} style={{marginRight: 4}} />Refresh
                </button>
              </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Customer Segment</label>
                <select className="form-select" value={segment} onChange={e => setSegment(e.target.value)}>
                  <option value="">All Segments</option>
                  <option value="loyal">Loyal</option>
                  <option value="atrisk">At Risk</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Opportunity Type</label>
                <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="upsell">Upsell</option>
                  <option value="retention">Retention</option>
                  <option value="engagement">Engagement</option>
                </select>
              </div>
              <div className="form-group" style={{display: 'flex', alignItems: 'end'}}>
                <button className="btn btn-secondary" onClick={applyFilters}>
                  <Target size={16} style={{marginRight: 4}} />Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="recommendations-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
            margin: '2rem 0'
          }}>
            {(() => {
              const startIdx = (currentPage - 1) * pageSize;
              const endIdx = startIdx + pageSize;
              const paginatedRecommendations = recommendations.slice(startIdx, endIdx);
              
              if (paginatedRecommendations.length === 0) {
                return (
                  <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666'}}>
                    <Target size={48} style={{marginBottom: '1rem', opacity: 0.5}} />
                    <h3>No recommendations match your filters</h3>
                    <p>Try adjusting your filter criteria or clear all filters</p>
                  </div>
                );
              }
              
              return paginatedRecommendations.map((rec, idx) => (
                <div key={`${rec.phone_number}_${startIdx + idx}`} style={{
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #eaeaea',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  minHeight: '280px'
                }}>
                  {/* Header */}
                  <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '1rem'}}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: '#fff',
                      borderRadius: '10px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '16px',
                      marginRight: '12px',
                      flexShrink: 0
                    }}>
                      {startIdx + idx + 1}
                    </div>
                    
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', fontSize: '16px', color: '#1f2937'}}>
                        Customer {rec.phone_number}
                      </div>
                      <div style={{fontSize: '14px', color: '#6b7280', marginTop: '2px'}}>
                        {rec.usage_category} Usage • {rec.customer_segment}
                      </div>
                    </div>
                    
                    <div style={{marginLeft: 'auto'}}>
                      <span style={{
                        background: rec.priority === 'high' ? '#fef2f2' : 
                                   rec.priority === 'medium' ? '#fffbeb' : '#f0fdf4',
                        color: rec.priority === 'high' ? '#dc2626' : 
                              rec.priority === 'medium' ? '#d97706' : '#059669',
                        borderRadius: '8px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {rec.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Opportunity Type */}
                  <div style={{marginBottom: '12px'}}>
                    <span style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      {rec.opportunity}
                    </span>
                  </div>

                  {/* Recommended Products */}
                  {rec.recommended_products && (
                    <div style={{marginBottom: '12px'}}>
                      <div style={{fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px'}}>
                        Recommended Products:
                      </div>
                      <div style={{fontSize: '14px', color: '#1f2937', fontWeight: '500'}}>
                        {rec.recommended_products}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div style={{marginBottom: '16px', color: '#4b5563', fontSize: '14px', lineHeight: '1.5', flex: 1}}>
                    {rec.type === 'retention' && 'Immediate retention offer with 20% discount and dedicated support. Address service concerns proactively.'}
                    {rec.type === 'engagement' && 'Introduce mid-tier service upgrades and personalized usage insights to increase engagement.'}
                    {rec.type === 'upsell' && 'Offer premium plan upgrades and exclusive features to loyal customers.'}
                  </div>

                  {/* Stats */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'}}>
                    <div style={{
                      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{fontWeight: '700', fontSize: '18px', color: '#1e40af'}}>
                        {rec.churn_probability !== undefined ? `${Math.round(100 - rec.churn_probability)}%` : '—'}
                      </div>
                      <div style={{fontSize: '12px', color: '#64748b', fontWeight: '500'}}>Acceptance Score</div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{fontWeight: '700', fontSize: '18px', color: '#065f46'}}>
                        {rec.revenue !== undefined ? `₹${Math.round(rec.revenue).toLocaleString('en-IN')}` : '₹—'}
                      </div>
                      <div style={{fontSize: '12px', color: '#64748b', fontWeight: '500'}}>Potential Revenue</div>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Pagination */}
          {recommendations.length > pageSize && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2rem 0'}}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                style={{padding: '8px 16px'}}
              >
                Previous
              </button>
              <span style={{fontWeight: '500', fontSize: '14px', color: '#374151'}}>
                Page {currentPage} of {Math.ceil(recommendations.length / pageSize)}
              </span>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(recommendations.length / pageSize), p + 1))} 
                disabled={currentPage === Math.ceil(recommendations.length / pageSize)}
                style={{padding: '8px 16px'}}
              >
                Next
              </button>
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
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  <button className="btn btn-secondary" onClick={() => exportRecommendations('csv')}>
                    <FileText size={16} style={{marginRight: 4}} />Export CSV
                  </button>
                  <button className="btn btn-secondary" onClick={() => exportRecommendations('pdf')}>
                    <FileText size={16} style={{marginRight: 4}} />Export PDF
                  </button>
                  <button className="btn btn-success" onClick={sendToSalesTeam}>
                    <Send size={16} style={{marginRight: 4}} />Send to Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecommendationModel;