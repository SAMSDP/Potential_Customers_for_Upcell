from django.http import JsonResponse
from django.db.models import Avg
from .models import FinalOut

# Helper function to categorize based on churn probability
def categorize_customer(churn_prob, avg_prob, tolerance=0.05):
    if churn_prob < avg_prob - tolerance:
        return "loyal"
    elif churn_prob > avg_prob + tolerance:
        return "at_risk"
    else:
        return "neutral"

# 1. Customer Segment Counts
def customer_segment_counts(request):
    data = FinalOut.objects.all()
    avg_prob = data.aggregate(Avg('churn_probability'))['churn_probability__avg'] or 0

    segments = {"loyal": 0, "neutral": 0, "at_risk": 0}

    for customer in data:
        segment = categorize_customer(customer.churn_probability, avg_prob)
        segments[segment] += 1

    return JsonResponse(segments)


# 2. Segment Counts + Tenure (for Scatter/Cluster Plot)
def segment_counts_with_tenure(request):
    data = FinalOut.objects.all()
    avg_prob = data.aggregate(Avg('churn_probability'))['churn_probability__avg'] or 0

    response = {
        "loyal": {"count": 0, "tenure": []},
        "neutral": {"count": 0, "tenure": []},
        "at_risk": {"count": 0, "tenure": []},
    }

    for customer in data:
        segment = categorize_customer(customer.churn_probability, avg_prob)
        response[segment]["count"] += 1
        response[segment]["tenure"].append(customer.tenure)

    return JsonResponse(response)


# 3. Segment Metrics (Summary Stats)
def segment_metrics(request):
    data = FinalOut.objects.all()
    avg_prob = data.aggregate(Avg('churn_probability'))['churn_probability__avg'] or 0

    metrics = {
        "loyal": {"avg_tenure": 0, "avg_revenue": 0, "avg_churn_rate": 0, "count": 0},
        "neutral": {"avg_tenure": 0, "avg_revenue": 0, "avg_churn_rate": 0, "count": 0},
        "at_risk": {"avg_tenure": 0, "avg_revenue": 0, "avg_churn_rate": 0, "count": 0},
    }

    for customer in data:
        segment = categorize_customer(customer.churn_probability, avg_prob)
        revenue = (
            (customer.day_charge or 0)
            + (customer.eve_charge or 0)
            + (customer.night_charge or 0)
            + (customer.intl_charge or 0)
        )

        metrics[segment]["avg_tenure"] += customer.tenure or 0
        metrics[segment]["avg_revenue"] += revenue
        metrics[segment]["avg_churn_rate"] += customer.churn_prediction or 0
        metrics[segment]["count"] += 1

    # Final averages
    for seg in metrics:
        count = metrics[seg]["count"]
        if count > 0:
            metrics[seg]["avg_tenure"] /= count
            metrics[seg]["avg_revenue"] /= count
            metrics[seg]["avg_churn_rate"] = (metrics[seg]["avg_churn_rate"] / count) * 100

    return JsonResponse(metrics)
