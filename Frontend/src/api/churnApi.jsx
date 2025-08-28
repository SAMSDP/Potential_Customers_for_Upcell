
// churnApi.jsx
import telco from "../database/telco.js";

export function getTelco() {

  const totalCustomers = telco.data.length;

  const churnedCustomers = telco.data.filter(t => t.churn === 'Yes').length;
  const churnRate = ((churnedCustomers / totalCustomers) * 100).toFixed(1);

  const avgRevenue =
    telco.data.reduce((acc, t) => acc + t.monthly_charges, 0) / totalCustomers;

  const avgTenure =
    telco.data.reduce((acc, t) => acc + t.tenure, 0) / totalCustomers;

  // Example for highRiskCustomers (e.g., tenure < 6 months and churn = 'Yes')
  const highRiskCustomers = telco.data.filter(t => t.tenure < 6 && t.churn === 'Yes').length;

  return {
    totalCustomers,
    churnRate: parseFloat(churnRate),
    avgRevenue: parseFloat(avgRevenue.toFixed(2)),
    avgTenure: Math.round(avgTenure),
    highRiskCustomers,
  };
}
