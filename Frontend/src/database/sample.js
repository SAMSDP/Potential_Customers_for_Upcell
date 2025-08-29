// Customer Churn Prediction Dataset - Simulating PostgreSQL table structure

const churnCustomerData = [
  {
    customer_id: 'CUST_1001',
    phone_number: '999-9897',
    account_length: 228,
    vmail_message: 0,
    day_mins: 222.0,
    day_calls: 99,
    day_charge: 88.08,
    eve_mins: 220.2,
    eve_calls: 80,
    eve_charge: 22.92,
    night_mins: 282.9,
    night_calls: 28,
    night_charge: 20.22,
    intl_mins: 2.2,
    intl_calls: 8,
    intl_charge: 0.82,
    tenure: 8,
    custserv_calls: 0,
    churn_prediction: 0,
    usage_category: 0,
    churn_probability: 0.0552,
    customer_status: 'Loyal',
    customer_segment: 'Loyal',
    recommended_products: ['Basic Retention Offer'],
    top_10_features: [
      { feature: 'Day Mins', importance: 11.92 },
      { feature: 'Day Charge', importance: 10.35 },
      { feature: 'Night Charge', importance: 7.45 },
      { feature: 'Eve Charge', importance: 7.38 },
      { feature: 'Eve Mins', importance: 7.28 },
      { feature: 'Night Mins', importance: 6.77 },
      { feature: 'Intl Mins', importance: 6.57 },
      { feature: 'Intl Charge', importance: 6.32 },
      { feature: 'Day Calls', importance: 6.05 },
      { feature: 'Account Length', importance: 5.92 }
    ]
  },
  {
    customer_id: 'CUST_1002',
    phone_number: '786-7589',
    account_length: 228,
    vmail_message: 0,
    day_mins: 226.2,
    day_calls: 98,
    day_charge: 86.28,
    eve_mins: 288.2,
    eve_calls: 208,
    eve_charge: 28.28,
    night_mins: 800.0,
    night_calls: 228,
    night_charge: 28.8,
    intl_mins: 20.0,
    intl_calls: 8,
    intl_charge: 2.2,
    tenure: 13,
    custserv_calls: 2,
    churn_prediction: 0,
    usage_category: 0,
    churn_probability: 0.1703,
    customer_status: 'Loyal',
    customer_segment: 'Loyal',
    recommended_products: ['Basic Retention Offer'],
    top_10_features: [
      { feature: 'Day Mins', importance: 11.92 },
      { feature: 'Day Charge', importance: 10.35 },
      { feature: 'Night Charge', importance: 7.45 },
      { feature: 'Eve Charge', importance: 7.38 },
      { feature: 'Eve Mins', importance: 7.28 },
      { feature: 'Night Mins', importance: 6.77 },
      { feature: 'Intl Mins', importance: 6.57 },
      { feature: 'Intl Charge', importance: 6.32 },
      { feature: 'Day Calls', importance: 6.05 },
      { feature: 'Account Length', importance: 5.92 }
    ]
  }
  // … add more mock rows
];

function generateChurnCustomerData(count = 5000) {
  const data = [...churnCustomerData];

  for (let i = data.length; i < count; i++) {
    data.push({
      customer_id: `CUST_${1000 + i}`,
      phone_number: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      account_length: Math.floor(Math.random() * 250),
      vmail_message: Math.floor(Math.random() * 20),
      day_mins: +(Math.random() * 400).toFixed(1),
      day_calls: Math.floor(Math.random() * 150),
      day_charge: +(Math.random() * 100).toFixed(2),
      eve_mins: +(Math.random() * 500).toFixed(1),
      eve_calls: Math.floor(Math.random() * 250),
      eve_charge: +(Math.random() * 50).toFixed(2),
      night_mins: +(Math.random() * 900).toFixed(1),
      night_calls: Math.floor(Math.random() * 250),
      night_charge: +(Math.random() * 40).toFixed(2),
      intl_mins: +(Math.random() * 25).toFixed(1),
      intl_calls: Math.floor(Math.random() * 10),
      intl_charge: +(Math.random() * 10).toFixed(2),
      tenure: Math.floor(Math.random() * 50),
      custserv_calls: Math.floor(Math.random() * 10),
      churn_prediction: Math.random() > 0.8 ? 1 : 0,
      usage_category: Math.floor(Math.random() * 3),
      churn_probability: +(Math.random()).toFixed(4),
      customer_status: Math.random() > 0.2 ? 'Loyal' : 'At Risk',
      customer_segment: ['Loyal', 'High-Value', 'Price-Sensitive'][Math.floor(Math.random() * 3)],
      recommended_products: ['Basic Retention Offer', 'Discount Plan', 'Premium Upgrade'].slice(0, Math.floor(Math.random() * 3) + 1),
      top_10_features: [
        { feature: 'Day Mins', importance: +(Math.random() * 12).toFixed(2) },
        { feature: 'Day Charge', importance: +(Math.random() * 10).toFixed(2) },
        { feature: 'Night Charge', importance: +(Math.random() * 8).toFixed(2) },
        { feature: 'Eve Charge', importance: +(Math.random() * 8).toFixed(2) },
        { feature: 'Eve Mins', importance: +(Math.random() * 8).toFixed(2) },
        { feature: 'Night Mins', importance: +(Math.random() * 8).toFixed(2) },
        { feature: 'Intl Mins', importance: +(Math.random() * 7).toFixed(2) },
        { feature: 'Intl Charge', importance: +(Math.random() * 7).toFixed(2) },
        { feature: 'Day Calls', importance: +(Math.random() * 6).toFixed(2) },
        { feature: 'Account Length', importance: +(Math.random() * 6).toFixed(2) }
      ]
    });
  }

  return data;
}

const churnCustomerSchema = {
  table_name: 'customer_churn_predictions',
  columns: [
    { name: 'customer_id', type: 'VARCHAR(20)', primary_key: true },
    { name: 'phone_number', type: 'VARCHAR(20)' },
    { name: 'account_length', type: 'INTEGER' },
    { name: 'vmail_message', type: 'INTEGER' },
    { name: 'day_mins', type: 'DECIMAL(8,2)' },
    { name: 'day_calls', type: 'INTEGER' },
    { name: 'day_charge', type: 'DECIMAL(8,2)' },
    { name: 'eve_mins', type: 'DECIMAL(8,2)' },
    { name: 'eve_calls', type: 'INTEGER' },
    { name: 'eve_charge', type: 'DECIMAL(8,2)' },
    { name: 'night_mins', type: 'DECIMAL(8,2)' },
    { name: 'night_calls', type: 'INTEGER' },
    { name: 'night_charge', type: 'DECIMAL(8,2)' },
    { name: 'intl_mins', type: 'DECIMAL(8,2)' },
    { name: 'intl_calls', type: 'INTEGER' },
    { name: 'intl_charge', type: 'DECIMAL(8,2)' },
    { name: 'tenure', type: 'INTEGER' },
    { name: 'custserv_calls', type: 'INTEGER' },
    { name: 'churn_prediction', type: 'BOOLEAN' },
    { name: 'usage_category', type: 'SMALLINT' },
    { name: 'churn_probability', type: 'DECIMAL(6,4)' },
    { name: 'customer_status', type: 'VARCHAR(50)' },
    { name: 'customer_segment', type: 'VARCHAR(50)' },
    { name: 'recommended_products', type: 'JSONB' },
    { name: 'top_10_features', type: 'JSONB' }
  ],
  indexes: [
    'CREATE INDEX idx_churn_prediction ON customer_churn_predictions(churn_prediction)',
    'CREATE INDEX idx_segment ON customer_churn_predictions(customer_segment)'
  ]
};

// Export mock DB
const churnDB = {
  data: generateChurnCustomerData(),
  schema: churnCustomerSchema
};

export default churnDB;
