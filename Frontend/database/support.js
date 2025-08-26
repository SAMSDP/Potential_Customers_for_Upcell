// Customer Support Dataset - Simulating PostgreSQL table structure
const supportData = [
    {
        ticket_id: 'SUP_001',
        customer_id: 'TELCO_001',
        issue_type: 'Technical',
        priority: 'High',
        status: 'Resolved',
        satisfaction_rating: 4,
        resolution_time_hours: 24,
        created_date: '2024-01-15',
        resolved_date: '2024-01-16',
        agent_id: 'AGT_001',
        channel: 'Phone',
        product: 'Internet Service'
    },
    {
        ticket_id: 'SUP_002',
        customer_id: 'TELCO_002',
        issue_type: 'Billing',
        priority: 'Medium',
        status: 'Open',
        satisfaction_rating: null,
        resolution_time_hours: null,
        created_date: '2024-01-20',
        resolved_date: null,
        agent_id: 'AGT_002',
        channel: 'Email',
        product: 'Phone Service'
    },
    {
        ticket_id: 'SUP_003',
        customer_id: 'TELCO_003',
        issue_type: 'Service Request',
        priority: 'Low',
        status: 'Resolved',
        satisfaction_rating: 5,
        resolution_time_hours: 48,
        created_date: '2024-01-18',
        resolved_date: '2024-01-20',
        agent_id: 'AGT_003',
        channel: 'Chat',
        product: 'Bundle'
    }
];

function generateSupportData(count = 500) {
    const data = [...supportData];
    const issueTypes = ['Technical', 'Billing', 'Service Request', 'Account', 'Product Inquiry'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const channels = ['Phone', 'Email', 'Chat', 'Web Portal'];
    const products = ['Internet Service', 'Phone Service', 'TV Service', 'Bundle'];
    const agents = Array.from({length: 20}, (_, i) => `AGT_${String(i + 1).padStart(3, '0')}`);
    
    for (let i = data.length; i < count; i++) {
        const createdDate = new Date(2024, 0, 1 + Math.floor(Math.random() * 30));
        const isResolved = Math.random() < 0.8; // 80% resolution rate
        const resolutionHours = isResolved ? Math.floor(Math.random() * 72) + 1 : null;
        const resolvedDate = isResolved ? 
            new Date(createdDate.getTime() + (resolutionHours * 60 * 60 * 1000)) : null;
        
        data.push({
            ticket_id: `SUP_${String(i + 1).padStart(3, '0')}`,
            customer_id: `TELCO_${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
            issue_type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            status: isResolved ? 'Resolved' : statuses[Math.floor(Math.random() * 3)],
            satisfaction_rating: isResolved ? Math.floor(Math.random() * 5) + 1 : null,
            resolution_time_hours: resolutionHours,
            created_date: createdDate.toISOString().split('T')[0],
            resolved_date: resolvedDate ? resolvedDate.toISOString().split('T')[0] : null,
            agent_id: agents[Math.floor(Math.random() * agents.length)],
            channel: channels[Math.floor(Math.random() * channels.length)],
            product: products[Math.floor(Math.random() * products.length)]
        });
    }
    
    return data;
}

const supportSchema = {
    table_name: 'customer_support',
    columns: [
        { name: 'ticket_id', type: 'VARCHAR(20)', primary_key: true },
        { name: 'customer_id', type: 'VARCHAR(20)', foreign_key: 'telco_customers.customer_id' },
        { name: 'issue_type', type: 'VARCHAR(50)' },
        { name: 'priority', type: 'VARCHAR(20)' },
        { name: 'status', type: 'VARCHAR(20)' },
        { name: 'satisfaction_rating', type: 'INTEGER' },
        { name: 'resolution_time_hours', type: 'INTEGER' },
        { name: 'created_date', type: 'DATE' },
        { name: 'resolved_date', type: 'DATE' },
        { name: 'agent_id', type: 'VARCHAR(20)' },
        { name: 'channel', type: 'VARCHAR(30)' },
        { name: 'product', type: 'VARCHAR(50)' }
    ],
    indexes: [
        'CREATE INDEX idx_customer_id ON customer_support(customer_id)',
        'CREATE INDEX idx_status ON customer_support(status)',
        'CREATE INDEX idx_created_date ON customer_support(created_date)'
    ]
};

window.supportData = generateSupportData();
window.supportSchema = supportSchema;