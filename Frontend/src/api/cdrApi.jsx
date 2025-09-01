// cdrApi.jsx

import cdr from "../database/cdr.js";


export function getCdr() {
  // Example: calculate upsellCandidates as customers with account_length > 100 (business logic example)
  const upsellCandidates = cdr.data.filter(c => c.account_length > 100).length;

  // Aggregate Voice Minutes (sum of day, eve, night, intl mins per customer, then average)
  const totalVoiceMins = cdr.data.reduce((acc, c) => acc + c.day_mins + c.eve_mins + c.night_mins + (c.intl_mins || 0), 0);
  const avgVoiceMins = (totalVoiceMins / cdr.data.length).toFixed(1);

  // Simulate Data Usage (GB) as a random value per customer (if not present in dataset)
  // For demo, let's use: data_usage_gb = (day_mins + eve_mins + night_mins) * 0.02
  const totalDataUsage = cdr.data.reduce((acc, c) => acc + ((c.day_mins + c.eve_mins + c.night_mins) * 0.02), 0);
  const avgDataUsage = (totalDataUsage / cdr.data.length).toFixed(2);

  // Simulate SMS Count as vmail_message (or random if not present)
  const totalSms = cdr.data.reduce((acc, c) => acc + (c.vmail_message || 0), 0);
  const avgSms = Math.round(totalSms / cdr.data.length);

  return {
    upsellCandidates,
    totalCustomers: cdr.data.length,
    avgVoiceMins: Number(avgVoiceMins),
    avgDataUsage: Number(avgDataUsage),
    avgSms,
    // Add other aggregated fields as needed
  };
}
