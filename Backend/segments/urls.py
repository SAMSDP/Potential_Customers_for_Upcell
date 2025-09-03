from django.urls import path
from . import views

urlpatterns = [
    path("customer-segments/", views.customer_segment_counts, name="customer_segment_counts"),
    path("customer-segments-tenure/", views.segment_counts_with_tenure, name="segment_counts_with_tenure"),
    path("customer-segments-metrics/", views.segment_metrics, name="segment_metrics"),
]
