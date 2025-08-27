
import React, { useRef, useState } from "react";
import { Home, TrendingUp, BarChart3, Brain, Users, Target, UploadCloud, FilePlus, Database, Download, AlertTriangle, Phone, Star, Check, Clock, Merge, MinusCircle, FileText } from "lucide-react";
import "../../assets/css/main.css";

const Prediction = () => {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ processed: 0, highRisk: 0, upsell: 0, neutral: 0 });
  const fileInput = useRef();

  // Handler stubs
  const handleFileUpload = e => {};
  const useSampleData = () => {};
  const downloadTemplate = () => {};
  const exportResults = format => {};

  return (
    <div className="prediction-page">
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
        <ul className="nav-menu">
          <li><a href="/" className="nav-link" data-page="dashboard"><Home size={18} />Dashboard</a></li>
          <li><a href="/analytics" className="nav-link" data-page="analytics"><BarChart3 size={18} />Analytics</a></li>
          <li><a href="/prediction" className="nav-link active" data-page="prediction"><Brain size={18} />Predictions</a></li>
          <li><a href="/segments" className="nav-link" data-page="segments"><Users size={18} />Segments</a></li>
          <li><a href="/recommendations" className="nav-link" data-page="recommendations"><Target size={18} />Recommendations</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>ML Predictions</h1>
          <p>Upload CDR data to predict churn and identify upsell opportunities</p>
        </header>

        <div className="prediction-workflow">
          {/* Upload Section */}
          <div className="upload-section">
            <div className="chart-card" style={{textAlign: 'center', padding: '3rem'}}>
              <div style={{marginBottom: '2rem'}}>
                <UploadCloud style={{width: 64, height: 64, color: 'var(--primary-blue)', marginBottom: 16}} />
                <h3>Upload CDR Data</h3>
                <p style={{color: 'var(--gray-600)', marginBottom: '2rem'}}>
                  Upload CSV or Excel file with Call Detail Records for ML analysis
                </p>
              </div>
              <div className="upload-area" style={{border: '2px dashed var(--gray-300)', borderRadius: 12, padding: '2rem', marginBottom: '2rem', transition: 'all 0.2s ease'}}>
                <input type="file" ref={fileInput} accept=".csv,.xlsx,.xls" style={{display: 'none'}} onChange={handleFileUpload} />
                <button className="btn btn-primary" onClick={() => fileInput.current && fileInput.current.click()}>
                  <FilePlus size={16} style={{marginRight: 4}} />Select CDR File
                </button>
                <p style={{marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)'}}>
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              <div className="sample-data" style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                <button className="btn btn-secondary" onClick={useSampleData}>
                  <Database size={16} style={{marginRight: 4}} />Use Sample Data
                </button>
                <button className="btn btn-secondary" onClick={downloadTemplate}>
                  <Download size={16} style={{marginRight: 4}} />Download Template
                </button>
              </div>
            </div>
          </div>

          {/* Processing Status */}
          {processing && (
            <div className="processing-section" style={{marginTop: 32}}>
              <div className="chart-card">
                <h3>ML Pipeline Processing</h3>
                <div className="processing-steps">
                  <div className="step"><div className="step-icon"><Database /></div><div className="step-content"><h4>Data Validation</h4><p>Validating CDR data format and completeness</p></div><div className="step-status"><div className="spinner"></div></div></div>
                  <div className="step"><div className="step-icon"><Brain /></div><div className="step-content"><h4>CDR Model Inference</h4><p>Running usage pattern analysis</p></div><div className="step-status"><Clock /></div></div>
                  <div className="step"><div className="step-icon"><Phone /></div><div className="step-content"><h4>Support Model Inference</h4><p>Predicting support interaction patterns</p></div><div className="step-status"><Clock /></div></div>
                  <div className="step"><div className="step-icon"><Users /></div><div className="step-content"><h4>Telco Model Inference</h4><p>Analyzing customer behavior patterns</p></div><div className="step-status"><Clock /></div></div>
                  <div className="step"><div className="step-icon"><Merge /></div><div className="step-content"><h4>Decision-Level Fusion</h4><p>Combining model outputs for final predictions</p></div><div className="step-status"><Clock /></div></div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results.length > 0 && (
            <div className="results-section" style={{marginTop: 32}}>
              <div className="results-summary">
                <div className="stats-row">
                  <div className="stat-card"><div className="stat-icon blue"><Users /></div><div className="stat-content"><h3>{summary.processed}</h3><p>Records Processed</p></div></div>
                  <div className="stat-card"><div className="stat-icon red"><AlertTriangle /></div><div className="stat-content"><h3>{summary.highRisk}</h3><p>High Churn Risk</p></div></div>
                  <div className="stat-card"><div className="stat-icon green"><TrendingUp /></div><div className="stat-content"><h3>{summary.upsell}</h3><p>Upsell Candidates</p></div></div>
                  <div className="stat-card"><div className="stat-icon orange"><Users /></div><div className="stat-content"><h3>{summary.neutral}</h3><p>Neutral Customers</p></div></div>
                </div>
              </div>
              <div className="table-container">
                <div style={{padding: '1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3>Prediction Results</h3>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <button className="btn btn-secondary" onClick={() => exportResults('csv')}><FileText size={16} style={{marginRight: 4}} />Export CSV</button>
                    <button className="btn btn-secondary" onClick={() => exportResults('pdf')}><FileText size={16} style={{marginRight: 4}} />Export PDF</button>
                  </div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Phone Number</th>
                      <th>Churn Probability</th>
                      <th>Upsell Score</th>
                      <th>Usage Category</th>
                      <th>Business Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table rows go here, stubbed for now */}
                    {results.length === 0 && (
                      <tr><td colSpan={6} style={{textAlign: 'center', color: '#888'}}>No results</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Prediction;
