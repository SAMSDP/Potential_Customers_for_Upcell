
// supportApi.jsx
import support from "../database/support.js";

export function getSupport() {
  // Example aggregations

  const openTickets = support.data.filter(ticket => ticket.ticket_status !== 'Closed').length;
  const avgSatisfaction =
    support.data.reduce((acc, ticket) => acc + (ticket.customer_satisfaction_rating || 0), 0) /
    (support.data.filter(ticket => ticket.customer_satisfaction_rating !== null).length || 1);

  return {
    openTickets,
    avgSatisfaction: parseFloat(avgSatisfaction.toFixed(2)),
  };
}
