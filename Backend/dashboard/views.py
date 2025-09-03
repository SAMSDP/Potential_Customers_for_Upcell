from django.http import JsonResponse
from django.db.models.functions import TruncMonth
from django.db.models import Avg, Count, Q
from .models import CdrData, CustomerSupportTicket, TelcoCustomerChurn, FinalOut


# ---- SUMMARY METRICS (for top KPI cards) ----
def summary_metrics(request):
    total_customers = TelcoCustomerChurn.objects.count()
    churned_customers = TelcoCustomerChurn.objects.filter(churn="Yes").count()

    churn_rate = round((churned_customers / total_customers) * 100, 1) if total_customers else 0
    avg_revenue = TelcoCustomerChurn.objects.aggregate(avg=Avg("monthlycharges"))['avg'] or 0
    avg_tenure = TelcoCustomerChurn.objects.aggregate(avg=Avg("tenure"))['avg'] or 0

    return JsonResponse({
        "totalCustomers": total_customers,
        "churnRate": churn_rate,
        "avgRevenue": round(avg_revenue, 2),
        "avgTenure": round(avg_tenure, 0),
    })


# ---- CHURN TREND (for dashboard chart) ----
def churn_trend(request):
    # Get the last 12 months' data
    churn_data = (
        TelcoCustomerChurn.objects
        .filter(created_at__gte="2024-01-01")  # You can set this dynamically based on the current date
        .annotate(month=TruncMonth('created_at'))  # Truncates the date to just the month
        .values('month')
        .annotate(churned=Count('customerid', filter=Q(churn="Yes")))
        .order_by('month')  # Sorts by the month
    )

    # Extract the churn counts and months
    churn_counts = [item['churned'] for item in churn_data]
    months = [item['month'].strftime('%b %Y') for item in churn_data]

    # If there are missing months, fill in the gaps with zero churned customers
    all_months = [
        "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", 
        "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"
    ]
    full_churn_counts = []
    for month in all_months:
        if month in months:
            full_churn_counts.append(churn_counts[months.index(month)])
        else:
            full_churn_counts.append(0)

    return JsonResponse({
        "labels": all_months,
        "datasets": [{
            "label": "Churned Customers",
            "data": full_churn_counts,
            "fill": True,
            "borderColor": "#3b82f6",
            "backgroundColor": "rgba(59,130,246,0.15)",
            "pointBackgroundColor": "#fff",
            "pointBorderColor": "#3b82f6",
            "pointRadius": 5,
            "tension": 0.4,
        }],
    })


# ---- QUICK INSIGHTS ----
def quick_insights(request):
    # Satisfaction Score from telco
    satisfaction = CustomerSupportTicket.objects.aggregate(avg=Avg("customer_satisfaction_rating"))["avg"] or 0  # <-- confirm if correct field

    # High churn risk: churn_probability > 0.3
    high_risk = FinalOut.objects.filter(churn_probability__gt=0.3).count()

    # Upsell Opportunities: usage_category = 2
    upsell = FinalOut.objects.filter(usage_category=2).count()

    return JsonResponse({
        "satisfactionScore": round(satisfaction, 2),
        "highChurnRisk": high_risk,
        "upsellOpportunities": upsell,
    })


# ---- CUSTOMER SEGMENTS ----
def customer_segments(request):
    loyal = FinalOut.objects.filter(churn_prediction=0).count()
    at_risk = FinalOut.objects.filter(churn_prediction=1).count()
    neutral = FinalOut.objects.filter(usage_category=1).count()

    return JsonResponse({
        "loyal": loyal,
        "atRisk": at_risk,
        "neutral": neutral,
    })
