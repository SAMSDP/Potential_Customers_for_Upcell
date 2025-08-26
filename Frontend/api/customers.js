// Customer API - Centralized data access layer
class CustomerAPI {
    static getDashboardStats() {
        const telcoCustomers = window.telcoData || [];
        const supportTickets = window.supportData || [];
        
        const totalCustomers = telcoCustomers.length;
        const churnedCustomers = telcoCustomers.filter(c => c.churn === 'Yes').length;
        const churnRate = totalCustomers > 0 ? ((churnedCustomers / totalCustomers) * 100).toFixed(1) : 0;
        
        const avgRevenue = telcoCustomers.length > 0 
            ? (telcoCustomers.reduce((sum, c) => sum + c.monthly_charges, 0) / telcoCustomers.length).toFixed(2)
            : 0;
            
        const avgTenure = telcoCustomers.length > 0
            ? Math.round(telcoCustomers.reduce((sum, c) => sum + c.tenure, 0) / telcoCustomers.length)
            : 0;
        
        const openTickets = supportTickets.filter(t => t.status === 'Open').length;
        const resolvedTickets = supportTickets.filter(t => t.status === 'Resolved');
        const avgSatisfaction = resolvedTickets.length > 0
            ? (resolvedTickets.reduce((sum, t) => sum + (t.satisfaction_rating || 0), 0) / resolvedTickets.length).toFixed(1)
            : 0;
        
        const highRiskCustomers = telcoCustomers.filter(c => 
            c.tenure < 12 && c.contract === 'Month-to-month'
        ).length;
        
        const upsellCandidates = telcoCustomers.filter(c => 
            c.tenure > 24 && c.monthly_charges < 60 && c.churn === 'No'
        ).length;
        
        return {
            totalCustomers,
            churnRate: parseFloat(churnRate),
            avgRevenue: parseFloat(avgRevenue),
            avgTenure,
            openTickets,
            avgSatisfaction: parseFloat(avgSatisfaction),
            highRiskCustomers,
            upsellCandidates
        };
    }
    
    static getChurnTrendData() {
        // Simulate monthly churn trend
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const churnRates = [26.5, 27.2, 26.8, 27.5, 26.9, 27.1];
        
        return {
            labels: months,
            datasets: [{
                label: 'Churn Rate (%)',
                data: churnRates,
                borderColor: '#ef4444',
                backgroundColor: '#fef2f2',
                tension: 0.4,
                fill: true
            }]
        };
    }
    
    static getSegmentData() {
        const telcoCustomers = window.telcoData || [];
        
        const segments = {
            loyal: 0,
            atRisk: 0,
            neutral: 0
        };
        
        telcoCustomers.forEach(customer => {
            if (customer.tenure > 24 && customer.churn === 'No') {
                segments.loyal++;
            } else if (customer.tenure < 12 || customer.churn === 'Yes') {
                segments.atRisk++;
            } else {
                segments.neutral++;
            }
        });
        
        return {
            labels: ['Loyal', 'At Risk', 'Neutral'],
            datasets: [{
                data: [segments.loyal, segments.atRisk, segments.neutral],
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderWidth: 0
            }]
        };
    }
    
    static getRecentActivity() {
        const activities = [
            {
                icon: 'user-plus',
                title: 'New customer onboarded',
                description: '2 hours ago',
                color: 'blue'
            },
            {
                icon: 'alert-triangle',
                title: 'High churn risk detected',
                description: '4 hours ago',
                color: 'red'
            },
            {
                icon: 'trending-up',
                title: 'Upsell opportunity identified',
                description: '6 hours ago',
                color: 'green'
            },
            {
                icon: 'phone',
                title: 'Support ticket resolved',
                description: '8 hours ago',
                color: 'blue'
            },
            {
                icon: 'star',
                title: '5-star customer review',
                description: '1 day ago',
                color: 'orange'
            }
        ];
        
        return activities;
    }
    
    static getCustomerAnalytics(filters = {}) {
        const telcoCustomers = window.telcoData || [];
        const supportTickets = window.supportData || [];
        const cdrRecords = window.cdrData || [];
        
        // Apply filters
        let filteredCustomers = telcoCustomers;
        
        if (filters.tenure) {
            if (filters.tenure === 'new') {
                filteredCustomers = filteredCustomers.filter(c => c.tenure <= 12);
            } else if (filters.tenure === 'old') {
                filteredCustomers = filteredCustomers.filter(c => c.tenure > 24);
            }
        }
        
        if (filters.contract) {
            filteredCustomers = filteredCustomers.filter(c => 
                c.contract.toLowerCase().includes(filters.contract.toLowerCase())
            );
        }
        
        // Calculate analytics
        const totalCustomers = filteredCustomers.length;
        const churnCount = filteredCustomers.filter(c => c.churn === 'Yes').length;
        const avgRevenue = filteredCustomers.reduce((sum, c) => sum + c.monthly_charges, 0) / totalCustomers;
        
        return {
            totalCustomers,
            churnCount,
            churnRate: (churnCount / totalCustomers * 100).toFixed(1),
            avgRevenue: avgRevenue.toFixed(2),
            customers: filteredCustomers
        };
    }
}

// Make API available globally
window.CustomerAPI = CustomerAPI;