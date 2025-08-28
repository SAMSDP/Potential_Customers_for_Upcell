// Telco Customer Dataset - Simulating PostgreSQL table structure
const telcoData = [
    {
        customer_id: 'TELCO_001',
        gender: 'Female',
        senior_citizen: 0,
        partner: 'Yes',
        dependents: 'No',
        tenure: 1,
        phone_service: 'No',
        multiple_lines: 'No phone service',
        internet_service: 'DSL',
        online_security: 'No',
        online_backup: 'Yes',
        device_protection: 'No',
        tech_support: 'No',
        streaming_tv: 'No',
        streaming_movies: 'No',
        contract: 'Month-to-month',
        paperless_billing: 'Yes',
        payment_method: 'Electronic check',
        monthly_charges: 29.85,
        total_charges: 29.85,
        churn: 'No'
    },
    {
        customer_id: 'TELCO_002',
        gender: 'Male',
        senior_citizen: 0,
        partner: 'No',
        dependents: 'No',
        tenure: 34,
        phone_service: 'Yes',
        multiple_lines: 'No',
        internet_service: 'DSL',
        online_security: 'Yes',
        online_backup: 'No',
        device_protection: 'Yes',
        tech_support: 'No',
        streaming_tv: 'No',
        streaming_movies: 'No',
        contract: 'One year',
        paperless_billing: 'No',
        payment_method: 'Mailed check',
        monthly_charges: 56.95,
        total_charges: 1889.50,
        churn: 'No'
    },
    {
        customer_id: 'TELCO_003',
        gender: 'Male',
        senior_citizen: 0,
        partner: 'No',
        dependents: 'No',
        tenure: 2,
        phone_service: 'Yes',
        multiple_lines: 'No',
        internet_service: 'DSL',
        online_security: 'Yes',
        online_backup: 'Yes',
        device_protection: 'No',
        tech_support: 'No',
        streaming_tv: 'No',
        streaming_movies: 'No',
        contract: 'Month-to-month',
        paperless_billing: 'Yes',
        payment_method: 'Mailed check',
        monthly_charges: 53.85,
        total_charges: 108.15,
        churn: 'Yes'
    }
];

// Generate more realistic Telco data
function generateTelcoData(count = 1000) {
    const data = [...telcoData];
    const genders = ['Male', 'Female'];
    const yesNo = ['Yes', 'No'];
    const internetServices = ['DSL', 'Fiber optic', 'No'];
    const contracts = ['Month-to-month', 'One year', 'Two year'];
    const paymentMethods = [
        'Electronic check',
        'Mailed check',
        'Bank transfer (automatic)',
        'Credit card (automatic)'
    ];
    
    for (let i = data.length; i < count; i++) {
        const tenure = Math.floor(Math.random() * 72) + 1;
        const monthlyCharges = Math.round((Math.random() * 100 + 20) * 100) / 100;
        const churn = Math.random() < 0.27 ? 'Yes' : 'No'; // ~27% churn rate
        
        data.push({
            customer_id: `TELCO_${String(i + 1).padStart(3, '0')}`,
            gender: genders[Math.floor(Math.random() * genders.length)],
            senior_citizen: Math.random() < 0.16 ? 1 : 0, // ~16% senior citizens
            partner: yesNo[Math.floor(Math.random() * yesNo.length)],
            dependents: Math.random() < 0.3 ? 'Yes' : 'No',
            tenure: tenure,
            phone_service: Math.random() < 0.9 ? 'Yes' : 'No',
            multiple_lines: Math.random() < 0.4 ? 'Yes' : 'No',
            internet_service: internetServices[Math.floor(Math.random() * internetServices.length)],
            online_security: yesNo[Math.floor(Math.random() * yesNo.length)],
            online_backup: yesNo[Math.floor(Math.random() * yesNo.length)],
            device_protection: yesNo[Math.floor(Math.random() * yesNo.length)],
            tech_support: yesNo[Math.floor(Math.random() * yesNo.length)],
            streaming_tv: yesNo[Math.floor(Math.random() * yesNo.length)],
            streaming_movies: yesNo[Math.floor(Math.random() * yesNo.length)],
            contract: contracts[Math.floor(Math.random() * contracts.length)],
            paperless_billing: Math.random() < 0.6 ? 'Yes' : 'No',
            payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            monthly_charges: monthlyCharges,
            total_charges: Math.round(tenure * monthlyCharges * 100) / 100,
            churn: churn
        });
    }
    
    return data;
}

// PostgreSQL-like schema
const telcoSchema = {
    table_name: 'telco_customers',
    columns: [
        { name: 'customer_id', type: 'VARCHAR(20)', primary_key: true },
        { name: 'gender', type: 'VARCHAR(10)' },
        { name: 'senior_citizen', type: 'INTEGER' },
        { name: 'partner', type: 'VARCHAR(5)' },
        { name: 'dependents', type: 'VARCHAR(5)' },
        { name: 'tenure', type: 'INTEGER' },
        { name: 'phone_service', type: 'VARCHAR(5)' },
        { name: 'multiple_lines', type: 'VARCHAR(20)' },
        { name: 'internet_service', type: 'VARCHAR(20)' },
        { name: 'online_security', type: 'VARCHAR(5)' },
        { name: 'online_backup', type: 'VARCHAR(5)' },
        { name: 'device_protection', type: 'VARCHAR(5)' },
        { name: 'tech_support', type: 'VARCHAR(5)' },
        { name: 'streaming_tv', type: 'VARCHAR(5)' },
        { name: 'streaming_movies', type: 'VARCHAR(5)' },
        { name: 'contract', type: 'VARCHAR(20)' },
        { name: 'paperless_billing', type: 'VARCHAR(5)' },
        { name: 'payment_method', type: 'VARCHAR(30)' },
        { name: 'monthly_charges', type: 'DECIMAL(8,2)' },
        { name: 'total_charges', type: 'DECIMAL(10,2)' },
        { name: 'churn', type: 'VARCHAR(5)' }
    ],
    indexes: [
        'CREATE INDEX idx_customer_id ON telco_customers(customer_id)',
        'CREATE INDEX idx_churn ON telco_customers(churn)',
        'CREATE INDEX idx_tenure ON telco_customers(tenure)'
    ]
};

// Export for use in frontend/backend
window.telcoData = generateTelcoData();
window.telcoSchema = telcoSchema;
