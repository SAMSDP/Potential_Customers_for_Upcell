// Call Detail Records Dataset - Simulating PostgreSQL table structure
const cdrData = [
    {
        call_id: 'CDR_001',
        customer_id: 'TELCO_001',
        phone_number: '+1234567890',
        call_date: '2024-01-15',
        call_time: '09:30:00',
        call_duration_minutes: 5.5,
        call_type: 'Voice',
        call_direction: 'Outgoing',
        destination_number: '+1987654321',
        roaming: 'No',
        data_usage_mb: 0,
        sms_count: 0,
        location_area: 'Urban',
        tower_id: 'TWR_001'
    },
    {
        call_id: 'CDR_002',
        customer_id: 'TELCO_002',
        phone_number: '+1234567891',
        call_date: '2024-01-15',
        call_time: '14:15:30',
        call_duration_minutes: 0,
        call_type: 'Data',
        call_direction: 'NA',
        destination_number: null,
        roaming: 'No',
        data_usage_mb: 150,
        sms_count: 0,
        location_area: 'Suburban',
        tower_id: 'TWR_002'
    },
    {
        call_id: 'CDR_003',
        customer_id: 'TELCO_003',
        phone_number: '+1234567892',
        call_date: '2024-01-15',
        call_time: '18:45:15',
        call_duration_minutes: 0,
        call_type: 'SMS',
        call_direction: 'Outgoing',
        destination_number: '+1555666777',
        roaming: 'Yes',
        data_usage_mb: 0,
        sms_count: 1,
        location_area: 'Rural',
        tower_id: 'TWR_003'
    }
];

function generateCDRData(count = 5000) {
    const data = [...cdrData];
    const callTypes = ['Voice', 'Data', 'SMS'];
    const directions = ['Incoming', 'Outgoing', 'NA'];
    const locations = ['Urban', 'Suburban', 'Rural'];
    const yesNo = ['Yes', 'No'];
    
    for (let i = data.length; i < count; i++) {
        const callType = callTypes[Math.floor(Math.random() * callTypes.length)];
        const customerId = `TELCO_${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`;
        const date = new Date(2024, 0, 1 + Math.floor(Math.random() * 30));
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        
        let duration = 0;
        let dataUsage = 0;
        let smsCount = 0;
        let direction = 'NA';
        let destinationNumber = null;
        
        if (callType === 'Voice') {
            duration = Math.round((Math.random() * 30 + 1) * 10) / 10; // 1-30 minutes
            direction = directions[Math.floor(Math.random() * 2)]; // Incoming/Outgoing
            destinationNumber = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        } else if (callType === 'Data') {
            dataUsage = Math.floor(Math.random() * 500) + 1; // 1-500 MB
            direction = 'NA';
        } else if (callType === 'SMS') {
            smsCount = Math.floor(Math.random() * 5) + 1; // 1-5 SMS
            direction = directions[Math.floor(Math.random() * 2)]; // Incoming/Outgoing
            destinationNumber = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        }
        
        data.push({
            call_id: `CDR_${String(i + 1).padStart(3, '0')}`,
            customer_id: customerId,
            phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            call_date: date.toISOString().split('T')[0],
            call_time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
            call_duration_minutes: duration,
            call_type: callType,
            call_direction: direction,
            destination_number: destinationNumber,
            roaming: yesNo[Math.floor(Math.random() * yesNo.length)],
            data_usage_mb: dataUsage,
            sms_count: smsCount,
            location_area: locations[Math.floor(Math.random() * locations.length)],
            tower_id: `TWR_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`
        });
    }
    
    return data;
}

const cdrSchema = {
    table_name: 'call_detail_records',
    columns: [
        { name: 'call_id', type: 'VARCHAR(20)', primary_key: true },
        { name: 'customer_id', type: 'VARCHAR(20)', foreign_key: 'telco_customers.customer_id' },
        { name: 'phone_number', type: 'VARCHAR(15)' },
        { name: 'call_date', type: 'DATE' },
        { name: 'call_time', type: 'TIME' },
        { name: 'call_duration_minutes', type: 'DECIMAL(8,2)' },
        { name: 'call_type', type: 'VARCHAR(10)' },
        { name: 'call_direction', type: 'VARCHAR(10)' },
        { name: 'destination_number', type: 'VARCHAR(15)' },
        { name: 'roaming', type: 'VARCHAR(5)' },
        { name: 'data_usage_mb', type: 'INTEGER' },
        { name: 'sms_count', type: 'INTEGER' },
        { name: 'location_area', type: 'VARCHAR(20)' },
        { name: 'tower_id', type: 'VARCHAR(20)' }
    ],
    indexes: [
        'CREATE INDEX idx_customer_id ON call_detail_records(customer_id)',
        'CREATE INDEX idx_call_date ON call_detail_records(call_date)',
        'CREATE INDEX idx_call_type ON call_detail_records(call_type)'
    ]
};

window.cdrData = generateCDRData();
window.cdrSchema = cdrSchema;