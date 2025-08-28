// Customer Support Dataset - Simulating PostgreSQL table structure

const supportData = [
  {
    ticket_id: 'SUP_001',
    customer_id: 'CUST_001',
    customer_name: 'Marisa Obrien',
    customer_email: 'carrollallison@example.com',
    customer_age: 32,
    customer_gender: 'Other',
    product_purchased: 'GoPro Hero',
    date_of_purchase: '2021-03-22',
    ticket_type: 'Technical issue',
    ticket_subject: 'Product setup',
    ticket_description: "I'm having an issue with the GoPro Hero. Please assist. Your billing zip code is: 71701. Please double check your email address. I've tried troubleshooting steps mentioned in the user manual, but the issue persists.",
    ticket_status: 'Pending Customer Response',
    resolution: null,
    ticket_priority: 'Critical',
    ticket_channel: 'Social media',
    first_response_time: '2023-06-01 12:15:00',
    time_to_resolution: null,
    customer_satisfaction_rating: null
  },
  {
    ticket_id: 'SUP_002',
    customer_id: 'CUST_002',
    customer_name: 'Jessica Rios',
    customer_email: 'clarkeashley@example.com',
    customer_age: 42,
    customer_gender: 'Female',
    product_purchased: 'LG Smart TV',
    date_of_purchase: '2021-05-22',
    ticket_type: 'Technical issue',
    ticket_subject: 'Peripheral compatibility',
    ticket_description: "I'm having an issue with the LG Smart TV. The issue is intermittent. Sometimes it works fine, but other times it acts up unexpectedly.",
    ticket_status: 'Pending Customer Response',
    resolution: null,
    ticket_priority: 'Critical',
    ticket_channel: 'Chat',
    first_response_time: '2023-06-01 16:45:00',
    time_to_resolution: null,
    customer_satisfaction_rating: null
  },
  {
    ticket_id: 'SUP_003',
    customer_id: 'CUST_003',
    customer_name: 'Christopher Robbins',
    customer_email: 'gonzalestracy@example.com',
    customer_age: 48,
    customer_gender: 'Other',
    product_purchased: 'Dell XPS',
    date_of_purchase: '2020-07-14',
    ticket_type: 'Technical issue',
    ticket_subject: 'Network problem',
    ticket_description: "The Dell XPS is not turning on. It was working fine until yesterday. I'm using the original charger, but it's not charging properly.",
    ticket_status: 'Closed',
    resolution: 'Replaced charger adapter',
    ticket_priority: 'Low',
    ticket_channel: 'Social media',
    first_response_time: '2023-06-01 11:14:00',
    time_to_resolution: '2023-06-01 18:05:00',
    customer_satisfaction_rating: 3
  }
  // …more rows from Excel
];

function generateSupportData(count = 1000) {
  const data = [...supportData];
  const ticketTypes = ['Technical issue', 'Billing inquiry', 'Service Request', 'Account issue', 'Product Inquiry'];
  const statuses = ['Open', 'In Progress', 'Pending Customer Response', 'Resolved', 'Closed'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const genders = ['Male', 'Female', 'Other'];
  const channels = ['Email', 'Phone', 'Chat', 'Social media', 'Web portal'];
  const products = ['GoPro Hero', 'LG Smart TV', 'Dell XPS', 'Microsoft Office', 'Autodesk AutoCAD', 'Adobe Photoshop', 'iPhone 14', 'Galaxy S22'];

  for (let i = data.length; i < count; i++) {
    const customerId = `CUST_${String(i + 1).padStart(3, '0')}`;
    const createdDate = new Date(2023, 5, 1 + Math.floor(Math.random() * 28)); // June 2023
    const resolved = Math.random() < 0.7; // 70% tickets resolved
    const resolutionTimeHrs = resolved ? Math.floor(Math.random() * 72) + 1 : null;
    const resolvedDate = resolved ? new Date(createdDate.getTime() + resolutionTimeHrs * 3600 * 1000) : null;

    data.push({
      ticket_id: `SUP_${String(i + 1).padStart(3, '0')}`,
      customer_id: customerId,
      customer_name: `Customer_${i + 1}`,
      customer_email: `customer${i + 1}@example.com`,
      customer_age: Math.floor(Math.random() * 60) + 18,
      customer_gender: genders[Math.floor(Math.random() * genders.length)],
      product_purchased: products[Math.floor(Math.random() * products.length)],
      date_of_purchase: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      ticket_type: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
      ticket_subject: `Issue_${Math.floor(Math.random() * 1000)}`,
      ticket_description: `Auto-generated issue description for ${customerId}`,
      ticket_status: resolved ? 'Closed' : statuses[Math.floor(Math.random() * statuses.length)],
      resolution: resolved ? 'Issue resolved with workaround' : null,
      ticket_priority: priorities[Math.floor(Math.random() * priorities.length)],
      ticket_channel: channels[Math.floor(Math.random() * channels.length)],
      first_response_time: createdDate.toISOString().replace('T', ' ').split('.')[0],
      time_to_resolution: resolvedDate ? resolvedDate.toISOString().replace('T', ' ').split('.')[0] : null,
      customer_satisfaction_rating: resolved ? Math.floor(Math.random() * 5) + 1 : null
    });
  }

  return data;
}

const supportSchema = {
  table_name: 'customer_support',
  columns: [
    { name: 'ticket_id', type: 'VARCHAR(20)', primary_key: true },
    { name: 'customer_id', type: 'VARCHAR(20)', foreign_key: 'telco_customers.customer_id' },
    { name: 'customer_name', type: 'VARCHAR(100)' },
    { name: 'customer_email', type: 'VARCHAR(100)' },
    { name: 'customer_age', type: 'INTEGER' },
    { name: 'customer_gender', type: 'VARCHAR(20)' },
    { name: 'product_purchased', type: 'VARCHAR(100)' },
    { name: 'date_of_purchase', type: 'DATE' },
    { name: 'ticket_type', type: 'VARCHAR(50)' },
    { name: 'ticket_subject', type: 'VARCHAR(200)' },
    { name: 'ticket_description', type: 'TEXT' },
    { name: 'ticket_status', type: 'VARCHAR(50)' },
    { name: 'resolution', type: 'TEXT' },
    { name: 'ticket_priority', type: 'VARCHAR(20)' },
    { name: 'ticket_channel', type: 'VARCHAR(30)' },
    { name: 'first_response_time', type: 'TIMESTAMP' },
    { name: 'time_to_resolution', type: 'TIMESTAMP' },
    { name: 'customer_satisfaction_rating', type: 'INTEGER' }
  ],
  indexes: [
    'CREATE INDEX idx_customer_id ON customer_support(customer_id)',
    'CREATE INDEX idx_ticket_status ON customer_support(ticket_status)',
    'CREATE INDEX idx_priority ON customer_support(ticket_priority)'
  ]
};


// Optionally export both data and schema
const support = {
  data: generateSupportData(),
  schema: supportSchema
};

export default support;
