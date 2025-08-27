
// Mock PostgreSQL table for CDR Dataset
const cdrData = [
	{
		customer_id: "TELCO_001",
		phone_number: "+1234567890",
		call_date: "2024-01-15",
		call_time: "09:30:00",
		call_duration_minutes: 5.5,
		call_type: "Voice",
		data_usage_mb: 0,
		sms_count: 0,
		location_area: "Urban"
	},
	{
		customer_id: "TELCO_002",
		phone_number: "+1234567891",
		call_date: "2024-01-15",
		call_time: "10:15:00",
		call_duration_minutes: 2.2,
		call_type: "Voice",
		data_usage_mb: 0,
		sms_count: 1,
		location_area: "Suburban"
	},
	{
		customer_id: "TELCO_003",
		phone_number: "+1234567892",
		call_date: "2024-01-16",
		call_time: "14:05:00",
		call_duration_minutes: 0,
		call_type: "Data",
		data_usage_mb: 120,
		sms_count: 0,
		location_area: "Urban"
	},
	{
		customer_id: "TELCO_004",
		phone_number: "+1234567893",
		call_date: "2024-01-16",
		call_time: "16:20:00",
		call_duration_minutes: 3.8,
		call_type: "Voice",
		data_usage_mb: 0,
		sms_count: 2,
		location_area: "Rural"
	}
];

export default cdrData;
