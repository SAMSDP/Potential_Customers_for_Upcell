# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("summary-metrics/", views.summary_metrics, name="summary-metrics"),
    path("churn-trend/", views.churn_trend, name="churn-trend"),
    path("quick-insights/", views.quick_insights, name="quick-insights"),
    path("customer-segments/", views.customer_segments, name="customer-segments"),
]
