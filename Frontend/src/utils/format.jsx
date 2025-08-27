// Formatting helpers
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

export function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}
