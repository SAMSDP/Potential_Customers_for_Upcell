from django.urls import path
from .views import CdrAnalyticsView, TelcoAnalyticsView, SupportAnalyticsView

urlpatterns = [
    path("cdr/", CdrAnalyticsView.as_view(), name="cdr-analytics"),
    path("telco/", TelcoAnalyticsView.as_view(), name="telco-analytics"),
    path("support/", SupportAnalyticsView.as_view(), name="support-analytics"),
]
