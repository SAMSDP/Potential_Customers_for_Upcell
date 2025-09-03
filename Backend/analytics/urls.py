from django.urls import path
from . import views

urlpatterns = [
    path("usage-vs-customers/", views.usage_vs_customers, name="usage_vs_customers"),
    path("customers-by-contract/", views.customers_by_contract, name="customers_by_contract"),
    path("payment-methods/", views.payment_methods, name="payment_methods"),
    path("revenue-distribution/", views.revenue_distribution, name="revenue_distribution"),
    path("customer-details/", views.customer_details, name="customer_details"),
]
