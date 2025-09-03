import churnDB from "../database/sample.js";

// Utility to assign priority
function determinePriority(customer) {
  if (customer.customer_status === "At Risk" && customer.churn_probability > 0.25) return "high";
  if (customer.customer_status === "Loyal" && customer.churn_probability < 0.1) return "low";
  return "medium";
}

// Utility to tag type by recommended_products (stub logic)
function determineType(products) {
  if ((products || []).some(p => p.toLowerCase().includes("upsell") || p.toLowerCase().includes("premium"))) return "upsell";
  if ((products || []).some(p => p.toLowerCase().includes("retention") || p.toLowerCase().includes("discount"))) return "retention";
  return "engagement";
}

// Main recommendations fetcher with filtering
export function getRecommendations({ segment = "", priority = "", type = "" } = {}) {
  return churnDB.data
    .map(customer => {
      const segmentLabel = (customer.customer_segment || "")
        .replace(/[-_\s]/g, "")
        .toLowerCase();
      const rec = {
        customer_id: customer.customer_id,
        segment: segmentLabel,
        status: (customer.customer_status || "").toLowerCase(),
        churn_probability: customer.churn_probability,
        recommended_products: customer.recommended_products,
        features: customer.top_10_features,
        priority: determinePriority(customer),
        type: determineType(customer.recommended_products),
        day_charge: customer.day_charge,
        eve_charge: customer.eve_charge,
        night_charge: customer.night_charge,
      };
      return rec;
    })
    .filter(rec =>
      (segment ? rec.segment === segment.replace(/[-_\s]/g, "").toLowerCase() : true) &&
      (priority ? rec.priority === priority.toLowerCase() : true) &&
      (type ? rec.type === type.toLowerCase() : true)
    );
}

// Strategy summary for top-cards
export function getRecommendationSummary() {
  const all = getRecommendations();
  // Use the same normalization as in getRecommendations
  const bySegment = {
    loyal: all.filter(r => r.segment === "loyal"),
    atRisk: all.filter(r => r.segment === "highvalue" || r.segment === "atrisk" || r.segment === "at-risk"),
    neutral: all.filter(r => r.segment === "pricesensitive" || r.segment === "neutral"),
  };
  return {
    loyal: bySegment.loyal.length,
    atRisk: bySegment.atRisk.length,
    neutral: bySegment.neutral.length,
    conversionRate: bySegment.loyal.length ? "22%" : "0%",
    retentionRate: bySegment.atRisk.length ? "17%" : "0%",
    engagementRate: bySegment.neutral.length ? "12%" : "0%",
  };
}

import sample from "../database/sample.js";


export function getSegmentStats() {
  const segments = [
    { key: "loyal", match: seg => seg === "loyal" },
    { key: "atRisk", match: seg => seg === "atrisk" || seg === "at-risk" || seg === "highvalue" },
    { key: "neutral", match: seg => seg === "neutral" || seg === "pricesensitive" }
  ];
  const stats = {};
  let totalLTV = 0, totalCount = 0;
  const INR_RATE = 83;

  segments.forEach(({ key, match }) => {
    const filtered = sample.data.filter(c => {
      const seg = (c.customer_segment || c.segment || "")
        .replace(/[-_\s]/g, "")
        .toLowerCase();
      return match(seg);
    });
    const count = filtered.length;
    const avgTenure = count ? Math.round(filtered.reduce((a, b) => a + (b.tenure || b.tenure_months || 0), 0) / count) : 0;
    // Calculate avgRevenue as sum of day_charge + eve_charge + night_charge (per month)
    const avgRevenue = count
      ? Math.round(
          filtered.reduce(
            (a, b) =>
              a +
              ((b.day_charge || 0) +
                (b.eve_charge || 0) +
                (b.night_charge || 0)),
            0
          ) / count
        )
      : 0;
    const churnRate = count ? (100 * filtered.filter(c => c.churned || c.churn_prediction === 1).length / count).toFixed(1) : "0.0";
    // Calculate LTV for each customer and sum
    totalLTV += filtered.reduce(
      (a, b) =>
        a +
        (((b.day_charge || 0) + (b.eve_charge || 0) + (b.night_charge || 0)) *
          (b.tenure || b.tenure_months || 0)),
      0
    );
    totalCount += count;
    stats[key] = { count, avgTenure, avgRevenue, churnRate };
  });

  // Calculate average LTV and convert to INR
  stats.avgLTV =
    totalCount && totalLTV
      ? `₹${Math.round((totalLTV / totalCount) * INR_RATE).toLocaleString("en-IN")}`
      : "₹0";
  // Also convert avgRevenue to INR for each segment
  Object.keys(stats).forEach(key => {
    if (stats[key].avgRevenue !== undefined) {
      stats[key].avgRevenue = `₹${Math.round(stats[key].avgRevenue * INR_RATE).toLocaleString("en-IN")}`;
    }
  });
  return stats;
}