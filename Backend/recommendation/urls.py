from django.urls import path
from . import views

urlpatterns = [
    path('segments/summary/', views.segment_counts, name='segment_counts'),
    path('segments/customers/', views.customer_details, name='customer_details'),
]
