
// Mock PostgreSQL table for Customer Support Dataset
const supportTickets = [
	{
		ticket_id: 1,
		customer_id: "TELCO_001",
		subject: "Product setup",
		issue_type: "Technical",
		status: "Open",
		resolution: "",
		satisfaction_rating: 4,
		created_at: "2024-01-10"
	},
	{
		ticket_id: 2,
		customer_id: "TELCO_002",
		subject: "Billing inquiry",
		issue_type: "Billing",
		status: "Closed",
		resolution: "Resolved billing error",
		satisfaction_rating: 5,
		created_at: "2024-01-12"
	},
	{
		ticket_id: 3,
		customer_id: "TELCO_003",
		subject: "Network problem",
		issue_type: "Technical",
		status: "Open",
		resolution: "",
		satisfaction_rating: 3,
		created_at: "2024-01-14"
	},
	{
		ticket_id: 4,
		customer_id: "TELCO_004",
		subject: "Account access",
		issue_type: "Account",
		status: "Closed",
		resolution: "Password reset",
		satisfaction_rating: 4,
		created_at: "2024-01-15"
	}
];

export default supportTickets;
