from django.urls import path
from . import views

urlpatterns = [
    path("cdr/", views.cdr_summary, name="cdr-summary"),
    path("support/", views.support_summary, name="support-summary"),
    path("telco/", views.telco_summary, name="telco-summary"),
    path("churn-trend/", views.churn_trend, name="churn-trend"),
]
