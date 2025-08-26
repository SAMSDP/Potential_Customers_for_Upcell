// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize tooltips and other UI elements
    initializeUI();
});

function initializeNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (currentPath === '/' || currentPath.includes('index.html')) {
            if (link.getAttribute('data-page') === 'dashboard') {
                link.classList.add('active');
            }
        } else {
            const href = link.getAttribute('href');
            if (currentPath.includes(href)) {
                link.classList.add('active');
            }
        }
    });
}

function initializeUI() {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .chart-card, .insight-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Dashboard specific functions
function loadDashboardData() {
    if (typeof window.CustomerAPI === 'undefined') {
        setTimeout(loadDashboardData, 100);
        return;
    }
    
    const stats = window.CustomerAPI.getDashboardStats();
    
    // Update stat cards
    document.getElementById('totalCustomers').textContent = stats.totalCustomers.toLocaleString();
    document.getElementById('churnRate').textContent = stats.churnRate + '%';
    document.getElementById('avgRevenue').textContent = '$' + stats.avgRevenue;
    document.getElementById('avgTenure').textContent = stats.avgTenure;
    
    // Update insight cards
    document.getElementById('highRiskCount').textContent = `${stats.highRiskCustomers} customers need attention`;
    document.getElementById('upsellCount').textContent = `${stats.upsellCandidates} customers ready for premium`;
    document.getElementById('supportTickets').textContent = `${stats.openTickets} open tickets this week`;
    document.getElementById('satisfactionScore').textContent = `${stats.avgSatisfaction}/5 average rating`;
    
    // Load charts
    if (typeof window.ChartManager !== 'undefined') {
        window.ChartManager.createChurnTrendChart('churnTrendChart');
        window.ChartManager.createSegmentChart('segmentChart');
    }
    
    // Load recent activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const activities = window.CustomerAPI.getRecentActivity();
    const activityList = document.getElementById('activityList');
    
    if (!activityList) return;
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i data-lucide="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h5>${activity.title}</h5>
                <p>${activity.description}</p>
            </div>
        </div>
    `).join('');
    
    // Reinitialize icons for the new content
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(num);
}

function formatPercentage(num) {
    return (num * 100).toFixed(1) + '%';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function downloadData(data, filename, type = 'json') {
    let content, mimeType;
    
    if (type === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
    } else if (type === 'csv') {
        content = convertToCSV(data);
        mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

function convertToCSV(data) {
    if (!data || !data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            }).join(',')
        )
    ].join('\n');
    
    return csvContent;
}

// Export functions for use in other files
window.mainApp = {
    loadDashboardData,
    loadRecentActivity,
    formatNumber,
    formatCurrency,
    formatPercentage,
    showNotification,
    downloadData
};