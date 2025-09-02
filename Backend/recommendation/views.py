from django.http import JsonResponse
from django.db.models import Avg, Count, Sum
from .models import FinalOut

def segment_counts(request):
    # Calculate overall average churn probability
    avg_churn = FinalOut.objects.aggregate(avg_cp=Avg('churn_probability'))['avg_cp'] or 0

    # Segmentation
    loyal_customers = FinalOut.objects.filter(churn_probability__lt=avg_churn)
    neutral_customers = FinalOut.objects.filter(churn_probability__gte=avg_churn*0.95, churn_probability__lte=avg_churn*1.05)
    at_risk_customers = FinalOut.objects.filter(churn_probability__gt=avg_churn)

    total_customers = FinalOut.objects.count()

    def segment_summary(queryset):
        total_products = sum(len(c.recommended_products.split(',')) if c.recommended_products else 0 for c in queryset)
        return {
            'count': queryset.count(),
            'recommended_products': total_products,
            'percentage': round((queryset.count() / total_customers * 100) if total_customers else 0, 2)
        }


    data = {
        'loyal': segment_summary(loyal_customers),
        'neutral': segment_summary(neutral_customers),
        'at_risk': segment_summary(at_risk_customers),
        'avg_churn_probability': round(avg_churn, 4)
    }

    return JsonResponse(data)


def customer_details(request):
    # Calculate avg churn for segmentation
    avg_churn = FinalOut.objects.aggregate(avg_cp=Avg('churn_probability'))['avg_cp'] or 0

    customers = FinalOut.objects.all()

    result = []
    for cust in customers:
        # Determine segment
        if cust.churn_probability < avg_churn:
            segment = 'Loyal'
            opportunity = 'Upcell Opportunity'
        elif cust.churn_probability > avg_churn:
            segment = 'At-Risk'
            opportunity = 'Retention Opportunity'
        else:
            segment = 'Neutral'
            opportunity = 'Engagement Opportunity'

        # Map usage category
        usage_map = {0: 'Low', 1: 'Medium', 2: 'High'}
        usage = usage_map.get(cust.usage_category, 'Unknown')

        # Compute revenue
        revenue = cust.day_charge + cust.eve_charge + cust.night_charge + cust.intl_charge

        result.append({
            'phone_number': cust.phone_number,
            'usage_category': usage,
            'customer_segment': segment,
            'opportunity': opportunity,
            'recommended_products': cust.recommended_products,
            'churn_probability': round(cust.churn_probability * 100, 2),
            'revenue': round(revenue, 2)
        })

    return JsonResponse(result, safe=False)
