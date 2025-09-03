import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Prediction from "./pages/Prediction";
import Segments from "./pages/Segments";
import SegmentsModel from "./pages/Segments_Model";
import Recommendations from "./pages/Recommendations";
import RecommendationsModel from "./pages/Recommendations_Model";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/segments" element={<Segments />} />
        <Route path="/segments_model" element={<SegmentsModel />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/recommendations_models" element={<RecommendationsModel />} />
      </Routes>
    </Router>
  );
}

export default App;
