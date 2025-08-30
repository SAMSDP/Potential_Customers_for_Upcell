from django.http import JsonResponse
from django.db.models import Avg, Count, Case, When, IntegerField
from django.views import View
from .models import CdrData, TelcoCustomerChurn, CustomerSupportTickets
from django.db.models import ExpressionWrapper, F, DurationField



# ---------- CDR ANALYTICS ----------
class CdrAnalyticsView(View):
    def get(self, request):
        stats = CdrData.objects.aggregate(
            avg_voice_mins=Avg('day_mins'),
            avg_data_usage=Avg('eve_mins'),
            avg_sms=Avg('vmail_message'),
            churn_rate=Avg(
                Case(
                    When(churn="t", then=1),
                    When(churn="f", then=0),
                    output_field=IntegerField(),
                )
            )
        )

        data = {
            "avgVoiceMins": round(stats['avg_voice_mins'] or 0, 2),
            "avgDataUsage": round(stats['avg_data_usage'] or 0, 2),
            "avgSms": round(stats['avg_sms'] or 0, 2),
            "churnRate": round((stats['churn_rate'] or 0) * 100, 2),  # %
        }
        return JsonResponse(data)


# ---------- TELCO ANALYTICS ----------
class TelcoAnalyticsView(View):
    def get(self, request):
        stats = TelcoCustomerChurn.objects.aggregate(
            total_customers=Count("customerid"),
            churned_customers=Count(
                Case(When(churn="Yes", then=1))
            ),
            avg_tenure=Avg("tenure"),
            avg_monthly=Avg("monthlycharges"),
        )

        data = {
            "totalCustomers": stats["total_customers"],
            "churnedCustomers": stats["churned_customers"],
            "avgTenure": round(stats["avg_tenure"] or 0, 2),
            "avgMonthlyCharges": round(stats["avg_monthly"] or 0, 2),
        }
        return JsonResponse(data)


# ---------- SUPPORT TICKET ANALYTICS ----------
class SupportAnalyticsView(View):
    def get(self, request):
        total = CustomerSupportTickets.objects.count()
        open_tickets = CustomerSupportTickets.objects.filter(ticket_status__icontains="Pending").count()
        closed_tickets = CustomerSupportTickets.objects.filter(ticket_status__icontains="Closed").count()

        # Check if required fields exist in the model
        model_fields = [f.name for f in CustomerSupportTickets._meta.get_fields()]

        avg_response, avg_resolution = None, None

        if "first_response_time" in model_fields and "date_of_purchase" in model_fields:
            avg_response = CustomerSupportTickets.objects.annotate(
                response_duration=ExpressionWrapper(
                    F("first_response_time") - F("date_of_purchase"),
                    output_field=DurationField()
                )
            ).aggregate(Avg("response_duration"))["response_duration__avg"]

        if "time_to_resolution" in model_fields and "date_of_purchase" in model_fields:
            avg_resolution = CustomerSupportTickets.objects.annotate(
                resolution_duration=ExpressionWrapper(
                    F("time_to_resolution") - F("date_of_purchase"),
                    output_field=DurationField()
                )
            ).aggregate(Avg("resolution_duration"))["resolution_duration__avg"]

        data = {
            "totalTickets": total,
            "openTickets": open_tickets,
            "closedTickets": closed_tickets,
            "avgResponseTime": str(avg_response) if avg_response else "N/A",
            "avgResolutionTime": str(avg_resolution) if avg_resolution else "N/A",
        }

        return JsonResponse(data)
