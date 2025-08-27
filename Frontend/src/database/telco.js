
// Mock PostgreSQL table for Telco Churn Dataset
const telcoData = [
	{
		customer_id: "TELCO_001",
		tenure: 36,
		contract: "Yearly",
		monthly_charges: 89.99,
		total_charges: 3239.64,
		churn: "No"
	},
	{
		customer_id: "TELCO_002",
		tenure: 6,
		contract: "Month-to-month",
		monthly_charges: 45.50,
		total_charges: 273.00,
		churn: "Yes"
	},
	{
		customer_id: "TELCO_003",
		tenure: 18,
		contract: "Yearly",
		monthly_charges: 65.00,
		total_charges: 1170.00,
		churn: "No"
	},
	{
		customer_id: "TELCO_004",
		tenure: 9,
		contract: "Month-to-month",
		monthly_charges: 39.99,
		total_charges: 359.91,
		churn: "Yes"
	}
];

export default telcoData;
