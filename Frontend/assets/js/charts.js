// Chart utilities and configurations
class ChartManager {
    static createChurnTrendChart(canvasId) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;
        
        const data = window.CustomerAPI.getChurnTrendData();
        
        return new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 30,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }
    
    static createSegmentChart(canvasId) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;
        
        const data = window.CustomerAPI.getSegmentData();
        
        return new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    static createUsageAnalysisChart(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Voice Minutes', 'Data Usage (GB)', 'SMS Count'],
                datasets: [{
                    label: 'Average Usage',
                    data: data || [450, 25, 120],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    static createChurnDistributionChart(canvasId) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;
        
        const telcoData = window.telcoData || [];
        const contractTypes = ['Month-to-month', 'One year', 'Two year'];
        const churnByContract = contractTypes.map(contract => {
            const customers = telcoData.filter(c => c.contract === contract);
            const churned = customers.filter(c => c.churn === 'Yes').length;
            return customers.length > 0 ? (churned / customers.length * 100) : 0;
        });
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: contractTypes,
                datasets: [{
                    label: 'Churn Rate (%)',
                    data: churnByContract,
                    backgroundColor: '#ef4444',
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    static createScatterPlot(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;
        
        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Loyal Customers',
                    data: data.loyal || [],
                    backgroundColor: '#10b981',
                    borderColor: '#059669'
                }, {
                    label: 'At Risk Customers',
                    data: data.atRisk || [],
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626'
                }, {
                    label: 'Neutral Customers',
                    data: data.neutral || [],
                    backgroundColor: '#f59e0b',
                    borderColor: '#d97706'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Usage Score'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Satisfaction Score'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Make ChartManager available globally
window.ChartManager = ChartManager;