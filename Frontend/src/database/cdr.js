// Customer CDR Profile Dataset - Simulating PostgreSQL table structure

const cdrCustomerData = [
  {
    customer_id: 'CUST_001',
    phone_number: '382-4657',
    account_length: 128,
    vmail_message: 25,
    day_mins: 265.1,
    day_calls: 110,
    day_charge: 45.07,
    eve_mins: 197.4,
    eve_calls: 99,
    eve_charge: 16.78,
    night_mins: 244.7,
    night_calls: 91,
    night_charge: 11.01,
    intl_mins: 10,
    intl_calls: 3,
    intl_charge: 2.7,
    custserv_calls: 1,
    churn: false
  },
  {
    customer_id: 'CUST_002',
    phone_number: '371-7191',
    account_length: 107,
    vmail_message: 26,
    day_mins: 161.6,
    day_calls: 123,
    day_charge: 27.47,
    eve_mins: 195.5,
    eve_calls: 103,
    eve_charge: 16.62,
    night_mins: 254.4,
    night_calls: 103,
    night_charge: 11.45,
    intl_mins: 13.7,
    intl_calls: 3,
    intl_charge: 3.7,
    custserv_calls: 1,
    churn: false
  },
  {
    customer_id: 'CUST_003',
    phone_number: '358-1921',
    account_length: 137,
    vmail_message: 0,
    day_mins: 243.4,
    day_calls: 114,
    day_charge: 41.38,
    eve_mins: 121.2,
    eve_calls: 110,
    eve_charge: 10.3,
    night_mins: 162.6,
    night_calls: 104,
    night_charge: 7.32,
    intl_mins: 12.2,
    intl_calls: 5,
    intl_charge: 3.29,
    custserv_calls: 0,
    churn: false
  }
  // … add more from Excel
];

function generateCustomerCDRData(count = 5000) {
  const data = [...cdrCustomerData];
  
  for (let i = data.length; i < count; i++) {
    data.push({
      customer_id: `CUST_${String(i + 1).padStart(3, '0')}`,
      phone_number: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      account_length: Math.floor(Math.random() * 200) + 1,
      vmail_message: Math.floor(Math.random() * 50),
      day_mins: +(Math.random() * 350).toFixed(1),
      day_calls: Math.floor(Math.random() * 150),
      day_charge: +(Math.random() * 60).toFixed(2),
      eve_mins: +(Math.random() * 350).toFixed(1),
      eve_calls: Math.floor(Math.random() * 150),
      eve_charge: +(Math.random() * 30).toFixed(2),
      night_mins: +(Math.random() * 350).toFixed(1),
      night_calls: Math.floor(Math.random() * 150),
      night_charge: +(Math.random() * 20).toFixed(2),
      intl_mins: +(Math.random() * 20).toFixed(1),
      intl_calls: Math.floor(Math.random() * 10),
      intl_charge: +(Math.random() * 5).toFixed(2),
      custserv_calls: Math.floor(Math.random() * 10),
      churn: Math.random() > 0.85 // ~15% churn rate
    });
  }

  return data;
}

const cdrCustomerSchema = {
  table_name: 'customer_cdr',
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
    { name: 'custserv_calls', type: 'INTEGER' },
    { name: 'churn', type: 'BOOLEAN' }
  ],
  indexes: [
    'CREATE INDEX idx_churn ON customer_cdr(churn)',
    'CREATE INDEX idx_account_length ON customer_cdr(account_length)'
  ]
};


// Optionally export both data and schema
const cdr = {
  data: generateCustomerCDRData(),
  schema: cdrCustomerSchema
};

export default cdr;
