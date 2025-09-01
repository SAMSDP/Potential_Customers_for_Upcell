from django.http import JsonResponse
from django.db.models import Avg, Count, Sum, Q
from .models import CdrData, CustomerSupportTicket, TelcoCustomerChurn

# ---- CDR API ----
def cdr_summary(request):
    total_customers = CdrData.objects.count()
    upsell_candidates = CdrData.objects.filter(account_length__gt=100).count()

    total_voice_mins = CdrData.objects.aggregate(
        total=Sum('day_mins') + Sum('eve_mins') + Sum('night_mins') + Sum('intl_mins')
    )['total'] or 0

    avg_voice_mins = round(total_voice_mins / total_customers, 1) if total_customers else 0

    return JsonResponse({
        "upsellCandidates": upsell_candidates,
        "totalCustomers": total_customers,
        "avgVoiceMins": avg_voice_mins
    })


# ---- SUPPORT API ----
def support_summary(request):
    open_tickets = CustomerSupportTicket.objects.exclude(ticket_status="Closed").count()

    avg_satisfaction = CustomerSupportTicket.objects.filter(
        customer_satisfaction_rating__isnull=False
    ).aggregate(avg=Avg('customer_satisfaction_rating'))['avg'] or 0

    return JsonResponse({
        "openTickets": open_tickets,
        "avgSatisfaction": round(avg_satisfaction, 2)
    })


# ---- TELCO API ----
def telco_summary(request):
    total_customers = TelcoCustomerChurn.objects.count()
    churned_customers = TelcoCustomerChurn.objects.filter(churn="Yes").count()

    churn_rate = round((churned_customers / total_customers) * 100, 1) if total_customers else 0
    avg_revenue = TelcoCustomerChurn.objects.aggregate(avg=Avg("monthlycharges"))['avg'] or 0
    avg_tenure = TelcoCustomerChurn.objects.aggregate(avg=Avg("tenure"))['avg'] or 0

    high_risk_customers = TelcoCustomerChurn.objects.filter(
        tenure__lt=6, churn="Yes"
    ).count()

    return JsonResponse({
        "totalCustomers": total_customers,
        "churnRate": churn_rate,
        "avgRevenue": round(avg_revenue, 2),
        "avgTenure": round(avg_tenure, 0),
        "highRiskCustomers": high_risk_customers
    })


# ---- CHURN TREND (for dashboard chart) ----
def churn_trend(request):
    trend = (
        TelcoCustomerChurn.objects.values("tenure")
        .annotate(churned=Count("customerid", filter=Q(churn="Yes")))
        .order_by("tenure")
    )

    return JsonResponse(list(trend), safe=False)
