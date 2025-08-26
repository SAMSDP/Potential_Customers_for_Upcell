// Recommendations API - Smart recommendation engine
class RecommendationsAPI {
    static generatePersonalizedRecommendations(customers, segments, supportData) {
        const recommendations = [];
        
        customers.forEach(customer => {
            const segment = this.determineCustomerSegment(customer, supportData);
            const recommendation = this.createRecommendation(customer, segment, supportData);
            
            if (recommendation) {
                recommendations.push(recommendation);
            }
        });
        
        return recommendations.sort((a, b) => b.priority_score - a.priority_score);
    }
    
    static determineCustomerSegment(customer, supportData) {
        const customerTickets = supportData.filter(t => t.customer_id === customer.customer_id);
        const avgSatisfaction = customerTickets.length > 0 
            ? customerTickets.reduce((sum, t) => sum + (t.satisfaction_rating || 3), 0) / customerTickets.length
            : 4;
        
        if (customer.tenure >= 24 && customer.churn === 'No' && avgSatisfaction >= 4) {
            return 'loyal';
        } else if (customer.tenure < 12 || customer.churn === 'Yes' || avgSatisfaction < 3) {
            return 'at-risk';
        } else {
            return 'neutral';
        }
    }
    
    static createRecommendation(customer, segment, supportData) {
        const customerTickets = supportData.filter(t => t.customer_id === customer.customer_id);
        const recentTickets = customerTickets.filter(t => 
            new Date(t.created_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
        
        let recommendation = null;
        
        switch (segment) {
            case 'loyal':
                recommendation = this.createLoyalRecommendation(customer, customerTickets);
                break;
            case 'at-risk':
                recommendation = this.createAtRiskRecommendation(customer, recentTickets);
                break;
            case 'neutral':
                recommendation = this.createNeutralRecommendation(customer, customerTickets);
                break;
        }
        
        return recommendation;
    }
    
    static createLoyalRecommendation(customer, tickets) {
        const upsellOptions = [
            {
                type: 'Premium Bundle Upgrade',
                description: 'Upgrade to premium bundle with enhanced features and priority support',
                potential_revenue: customer.monthly_charges * 0.4,
                acceptance_probability: 75
            },
            {
                type: 'Multi-Service Package',
                description: 'Add streaming services and enhanced internet speed',
                potential_revenue: customer.monthly_charges * 0.3,
                acceptance_probability: 70
            },
            {
                type: 'Family Plan Expansion',
                description: 'Upgrade to family plan with multiple lines',
                potential_revenue: customer.monthly_charges * 0.5,
                acceptance_probability: 65
            }
        ];
        
        const option = upsellOptions[Math.floor(Math.random() * upsellOptions.length)];
        
        return {
            customer_id: customer.customer_id,
            segment: 'loyal',
            type: 'upsell',
            title: option.type,
            description: option.description,
            priority: 'high',
            potential_revenue: Math.round(option.potential_revenue),
            acceptance_probability: option.acceptance_probability,
            priority_score: option.acceptance_probability * 0.8 + customer.monthly_charges * 0.2,
            recommended_action: 'Contact customer with personalized upgrade offer',
            timeline: '1-2 weeks',
            channel: 'Phone call from account manager'
        };
    }
    
    static createAtRiskRecommendation(customer, recentTickets) {
        const retentionOptions = [
            {
                type: 'Retention Discount',
                description: 'Offer 25% discount for next 6 months with improved service guarantee',
                retention_probability: 70
            },
            {
                type: 'Service Recovery',
                description: 'Proactive service improvement plan with dedicated support contact',
                retention_probability: 65
            },
            {
                type: 'Plan Optimization',
                description: 'Analyze usage and recommend cost-optimized plan',
                retention_probability: 60
            }
        ];
        
        const option = retentionOptions[Math.floor(Math.random() * retentionOptions.length)];
        const lifetimeValue = customer.monthly_charges * customer.tenure;
        
        return {
            customer_id: customer.customer_id,
            segment: 'at-risk',
            type: 'retention',
            title: option.type,
            description: option.description,
            priority: customer.churn === 'Yes' ? 'critical' : 'high',
            potential_revenue: lifetimeValue * 0.5, // Retention value
            acceptance_probability: option.retention_probability,
            priority_score: option.retention_probability * 0.9 + (recentTickets.length * 10),
            recommended_action: 'Immediate outreach with retention offer',
            timeline: '24-48 hours',
            channel: 'Direct call from retention specialist'
        };
    }
    
    static createNeutralRecommendation(customer, tickets) {
        const engagementOptions = [
            {
                type: 'Service Discovery',
                description: 'Introduce unused services based on usage patterns',
                engagement_score: 60
            },
            {
                type: 'Usage Insights',
                description: 'Provide personalized usage reports and optimization tips',
                engagement_score: 55
            },
            {
                type: 'Loyalty Program',
                description: 'Enroll in rewards program with exclusive benefits',
                engagement_score: 50
            }
        ];
        
        const option = engagementOptions[Math.floor(Math.random() * engagementOptions.length)];
        
        return {
            customer_id: customer.customer_id,
            segment: 'neutral',
            type: 'engagement',
            title: option.type,
            description: option.description,
            priority: 'medium',
            potential_revenue: customer.monthly_charges * 0.2,
            acceptance_probability: option.engagement_score,
            priority_score: option.engagement_score * 0.6 + customer.tenure * 0.4,
            recommended_action: 'Schedule engagement call or email campaign',
            timeline: '1-2 weeks',
            channel: 'Email campaign with follow-up call'
        };
    }
    
    static prioritizeRecommendations(recommendations) {
        return recommendations.sort((a, b) => {
            // Primary sort by priority
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            
            // Secondary sort by priority score
            return b.priority_score - a.priority_score;
        });
    }
    
    static filterRecommendations(recommendations, filters) {
        let filtered = recommendations;
        
        if (filters.segment) {
            filtered = filtered.filter(r => r.segment === filters.segment);
        }
        
        if (filters.type) {
            filtered = filtered.filter(r => r.type === filters.type);
        }
        
        if (filters.priority) {
            filtered = filtered.filter(r => r.priority === filters.priority);
        }
        
        if (filters.minRevenue) {
            filtered = filtered.filter(r => r.potential_revenue >= filters.minRevenue);
        }
        
        if (filters.minAcceptance) {
            filtered = filtered.filter(r => r.acceptance_probability >= filters.minAcceptance);
        }
        
        return filtered;
    }
    
    static exportRecommendations(recommendations, format = 'csv') {
        const exportData = recommendations.map(r => ({
            customer_id: r.customer_id,
            segment: r.segment,
            recommendation_type: r.type,
            title: r.title,
            description: r.description,
            priority: r.priority,
            potential_revenue: '$' + r.potential_revenue,
            acceptance_probability: r.acceptance_probability + '%',
            recommended_action: r.recommended_action,
            timeline: r.timeline,
            preferred_channel: r.channel
        }));
        
        return exportData;
    }
}

// Make API available globally
window.RecommendationsAPI = RecommendationsAPI;