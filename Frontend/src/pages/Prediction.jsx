import React, { useRef, useState } from "react";
import {
  Home, TrendingUp, BarChart3, Brain, Users, Target,
  UploadCloud, FilePlus, AlertTriangle, FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/main.css";
import { API_BASE_URL } from "../config/api";

const Prediction = () => {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsReady, setResultsReady] = useState(false);
  const [summary, setSummary] = useState({ processed: 0, highRisk: 0, upsell: 0, neutral: 0 });
  const [finalResponse, setFinalResponse] = useState(null);
  const [jobId, setJobId] = useState(null);
  const fileInput = useRef();
  const navigate = useNavigate();

  // Upload file → backend returns job_id
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    setResults([]);
    setResultsReady(false);
    setFinalResponse(null);
    setJobId(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/prediction/upload/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Upload response:", data);

      if (data.job_id) {
        setJobId(data.job_id);
        pollResults(data.job_id);
      } else {
        console.error("No job_id in response:", data);
        setProcessing(false);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setProcessing(false);
    }
  };

  // Convert usage_category code to label
  const getUsageCategory = (val) => {
    if (val === 0) return "Low";
    if (val === 1) return "Medium";
    if (val === 2) return "High";
    return "Unknown";
  };

  // Poll backend for results
  const pollResults = async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/prediction/results/${id}/`);

        if (res.status === 200) {
          const data = await res.json();
          console.log("Final results:", data);

          if (data.results) {
            // Compute average churn probability
            const churnProbs = data.results.map(r => r.Churn_Probability * 100);
            const avgChurn = churnProbs.reduce((a, b) => a + b, 0) / churnProbs.length;

            // Transform results into frontend format
            const transformed = data.results.map(r => {
              let businessAction = "Engagement Offer";
              if (r.Churn_Probability * 100 > avgChurn) {
                businessAction = "Retention Offer";
              } else if (r.Churn_Probability * 100 < avgChurn) {
                businessAction = "Upsell Offer";
              }
              return {
                phoneNumber: r["Phone Number"],
                churnProbability: (r.Churn_Probability * 100).toFixed(2),
                tenure: r.tenure,
                usageCategory: getUsageCategory(r.Usage_Category),
                businessAction,
              };
            });

            setResults(transformed);
            setFinalResponse(transformed);
            setResultsReady(true);
            setProcessing(false);
            clearInterval(interval);

            // Summary counts
            const highRisk = data.results.filter(r => r.Churn_Prediction === 1).length;
            const upsell = data.results.filter(r => r.Usage_Category === 2).length; // High usage
            const neutral = data.results.filter(r => r.Usage_Category === 0).length; // Low usage

            setSummary({
              processed: data.results.length,
              highRisk,
              upsell,
              neutral,
            });
          }
        } else {
          console.log("Still processing...", res.status);
        }
      } catch (err) {
        console.error("Polling failed:", err);
        clearInterval(interval);
        setProcessing(false);
      }
    }, 3000); // poll every 3s
  };

  const exportResults = (format) => {
    console.log(`Exporting as ${format.toUpperCase()}:`, results);
  };

  const getBadgeClass = (value, type) => {
    if (type === "churn") {
      return value > 70 ? "badge-error" : value > 40 ? "badge-warning" : "badge-success";
    } else if (type === "action") {
      return value === "Retention Offer"
        ? "badge-error"
        : value === "Upsell Offer"
        ? "badge-success"
        : "badge-warning";
    }
    return "badge-blue";
  };

  return (
    <div className="prediction-page">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp size={24} />
          <span>CustomerIQ</span>
        </div>
        <ul className="nav-menu">
          <li><a href="/" className="nav-link"><Home size={18} />Dashboard</a></li>
          <li><a href="/analytics" className="nav-link"><BarChart3 size={18} />Analytics</a></li>
          <li><a href="/prediction" className="nav-link active"><Brain size={18} />Predictions</a></li>
          <li><a href="/segments" className="nav-link"><Users size={18} />Segments</a></li>
          <li><a href="/recommendations" className="nav-link"><Target size={18} />Recommendations</a></li>
        </ul>
      </nav>

      {/* Main */}
      <main className="main-content">
        <header className="page-header">
          <h1>ML Predictions</h1>
          <p>Upload CDR data to predict churn and identify upsell opportunities</p>
        </header>

        <div className="prediction-workflow">
          {/* Upload */}
          <div className="upload-section">
            <div className="chart-card" style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ marginBottom: "2rem" }}>
                <UploadCloud size={64} style={{ color: "var(--primary-blue)", marginBottom: "1rem" }} />
                <h3>Upload CDR Data</h3>
                <p style={{ color: "var(--gray-600)", marginBottom: "2rem" }}>
                  Upload CSV or Excel file with Call Detail Records for ML analysis
                </p>
              </div>
              <div
                className="upload-area"
                style={{
                  border: "2px dashed var(--gray-300)",
                  borderRadius: 12,
                  padding: "2rem",
                  marginBottom: "2rem",
                }}
              >
                <input
                  type="file"
                  ref={fileInput}
                  accept=".csv,.xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => fileInput.current && fileInput.current.click()}
                  disabled={processing}
                >
                  <FilePlus size={16} style={{ marginRight: 8 }} />
                  {processing ? "Processing..." : "Select CDR File"}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {resultsReady && results.length > 0 && (
            <div className="results-section">
              <div className="results-summary">
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-icon blue"><Users size={24} /></div>
                    <div className="stat-content"><h3>{summary.processed}</h3><p>Records Processed</p></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon red"><AlertTriangle size={24} /></div>
                    <div className="stat-content"><h3>{summary.highRisk}</h3><p>High Churn Risk</p></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon green"><TrendingUp size={24} /></div>
                    <div className="stat-content"><h3>{summary.upsell}</h3><p>Upsell Candidates</p></div>
                  </div>
                </div>
              </div>

              {/* Table */}
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
                  <h3>Prediction Results</h3>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button className="btn btn-secondary" onClick={() => exportResults("csv")}>
                      <FileText size={16} style={{ marginRight: 8 }} />Export CSV
                    </button>
                    <button className="btn btn-secondary" onClick={() => exportResults("pdf")}>
                      <FileText size={16} style={{ marginRight: 8 }} />Export PDF
                    </button>
                  </div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Phone Number</th>
                      <th>Churn Probability</th>
                      <th>Tenure</th>
                      <th>Usage Category</th>
                      <th>Business Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td>{result.phoneNumber}</td>
                        <td>
                          <span className={`badge ${getBadgeClass(parseFloat(result.churnProbability), "churn")}`}>
                            {result.churnProbability}%
                          </span>
                        </td>
                        <td>{result.tenure}</td>
                        <td><span className="badge badge-blue">{result.usageCategory}</span></td>
                        <td>
                          <span className={`badge ${getBadgeClass(result.businessAction, "action")}`}>
                            {result.businessAction}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Segments Navigation */}
              <div style={{ marginTop: "2rem", textAlign: "right" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/segments_model", { state: { apiResponse: finalResponse } })}
              >
                Go to Segments →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Prediction;
