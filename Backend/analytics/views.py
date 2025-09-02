from django.http import JsonResponse
from django.db.models import Count
from .models import FinalOut, TelcoCustomerChurn

# 1. Usage vs Customers Count (Bar Chart)
def usage_vs_customers(request):
    # Query usage_category counts
    data = (
        FinalOut.objects.values("usage_category")
        .annotate(count=Count("usage_category"))
        .order_by("usage_category")
    )

    # Map numeric values to labels
    category_map = {0: "Low", 1: "Medium", 2: "High"}

    labels = [category_map.get(item["usage_category"], "Unknown") for item in data]
    counts = [item["count"] for item in data]

    # Prepare chart.js response
    chart_data = {
        "labels": labels,
        "datasets": [
            {
                "label": "Customers by Usage",
                "data": counts,
                "backgroundColor": ["#3b82f6", "#36A2EB", "#FFCE56"],  # Pie colors
            }
        ],
    }

    return JsonResponse(chart_data)


# 2. Customer Distribution by Contract (Bar Chart)
def customers_by_contract(request):
    data = (
        TelcoCustomerChurn.objects.values("contract")
        .annotate(count=Count("contract"))
        .order_by("contract")
    )

    labels = [item["contract"] for item in data]
    counts = [item["count"] for item in data]

    chart_data = {
        "labels": labels,
        "datasets": [
            {"label": "Contracts", "data": counts, "backgroundColor": "#FF6384"}
        ],
    }
    return JsonResponse(chart_data)


# 3. Payment Method (Doughnut Chart)
def payment_methods(request):
    data = (
        TelcoCustomerChurn.objects.values("paymentmethod")
        .annotate(count=Count("paymentmethod"))
        .order_by("paymentmethod")
    )

    labels = [item["paymentmethod"] for item in data]
    counts = [item["count"] for item in data]

    chart_data = {
        "labels": labels,
        "datasets": [
            {
                "label": "Payment Methods",
                "data": counts,
                "backgroundColor": [
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
            }
        ],
    }
    return JsonResponse(chart_data)


# 4. Revenue Distribution (Bar Chart)
def revenue_distribution(request):
    # Buckets for total charges
    buckets = {
        "0-1000": (0, 1000),
        "1000-2000": (1000, 2000),
        "2000-3000": (2000, 3000),
        "3000-4000": (3000, 4000),
        "4000+": (4000, 999999),
    }

    labels = []
    counts = []

    for label, (low, high) in buckets.items():
        count = TelcoCustomerChurn.objects.filter(
            totalcharges__gte=low, totalcharges__lt=high
        ).count()
        labels.append(label)
        counts.append(count)

    chart_data = {
        "labels": labels,
        "datasets": [
            {"label": "Revenue Distribution", "data": counts, "backgroundColor": "#FFCE56"}
        ],
    }
    return JsonResponse(chart_data)


# 5. Customer Details (Table Data)
def customer_details(request):
    data = TelcoCustomerChurn.objects.values(
        "customerid", "tenure", "contract", "monthlycharges", "gender"
    )[:200]  # limit to 200 rows for performance

    customers = list(data)
    return JsonResponse({"customers": customers})
