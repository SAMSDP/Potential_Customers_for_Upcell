from django.db import models


# ---------------- CDR DATA ----------------
class CdrData(models.Model):
    phone_number = models.CharField(max_length=20, primary_key=True, db_column="phone_number")
    account_length = models.IntegerField(db_column="account_length")
    vmail_message = models.IntegerField(db_column="vmail_message")
    day_mins = models.FloatField(db_column="day_mins")
    day_calls = models.IntegerField(db_column="day_calls")
    day_charge = models.FloatField(db_column="day_charge")
    eve_mins = models.FloatField(db_column="eve_mins")
    eve_calls = models.IntegerField(db_column="eve_calls")
    eve_charge = models.FloatField(db_column="eve_charge")
    night_mins = models.FloatField(db_column="night_mins")
    night_calls = models.IntegerField(db_column="night_calls")
    night_charge = models.FloatField(db_column="night_charge")
    intl_mins = models.FloatField(db_column="intl_mins")
    intl_calls = models.IntegerField(db_column="intl_calls")
    intl_charge = models.FloatField(db_column="intl_charge")
    custserv_calls = models.IntegerField(db_column="custserv_calls")
    churn = models.CharField(max_length=5, db_column="churn")  # 't' or 'f'

    class Meta:
        managed = False
        db_table = "cdr_data"  # match your actual DB table name


# ---------------- TELCO CUSTOMER CHURN ----------------
class TelcoCustomerChurn(models.Model):
    customerid = models.CharField(max_length=50, primary_key=True, db_column="customerid")
    gender = models.CharField(max_length=10, db_column="gender")
    seniorcitizen = models.IntegerField(db_column="seniorcitizen")
    partner = models.CharField(max_length=10, db_column="partner")
    dependents = models.CharField(max_length=10, db_column="dependents")
    tenure = models.IntegerField(db_column="tenure")
    phoneservice = models.CharField(max_length=20, db_column="phoneservice")
    multiplelines = models.CharField(max_length=50, db_column="multiplelines")
    internetservice = models.CharField(max_length=50, db_column="internetservice")
    onlinesecurity = models.CharField(max_length=50, db_column="onlinesecurity")
    onlinebackup = models.CharField(max_length=50, db_column="onlinebackup")
    deviceprotection = models.CharField(max_length=50, db_column="deviceprotection")
    techsupport = models.CharField(max_length=50, db_column="techsupport")
    streamingtv = models.CharField(max_length=50, db_column="streamingtv")
    streamingmovies = models.CharField(max_length=50, db_column="streamingmovies")
    contract = models.CharField(max_length=50, db_column="contract")
    paperlessbilling = models.CharField(max_length=10, db_column="paperlessbilling")
    paymentmethod = models.CharField(max_length=100, db_column="paymentmethod")
    monthlycharges = models.FloatField(db_column="monthlycharges")
    totalcharges = models.FloatField(db_column="totalcharges")
    churn = models.CharField(max_length=10, db_column="churn")  # 'Yes' or 'No'

    class Meta:
        managed = False
        db_table = "telco_customer_churn"


# ---------------- CUSTOMER SUPPORT TICKETS ----------------
class CustomerSupportTickets(models.Model):
    ticket_id = models.AutoField(primary_key=True, db_column="ticket_id")
    customer_name = models.CharField(max_length=100, db_column="customer_name")
    customer_email = models.CharField(max_length=100, db_column="customer_email")
    customer_age = models.IntegerField(db_column="customer_age", null=True, blank=True)
    customer_gender = models.CharField(max_length=50, db_column="customer_gender", null=True, blank=True)
    product_purchased = models.CharField(max_length=100, db_column="product_purchased", null=True, blank=True)
    date_of_purchase = models.DateTimeField(db_column="date_of_purchase", null=True, blank=True)
    ticket_type = models.CharField(max_length=100, db_column="ticket_type", null=True, blank=True)
    ticket_subject = models.CharField(max_length=200, db_column="ticket_subject", null=True, blank=True)
    ticket_description = models.TextField(db_column="ticket_description", null=True, blank=True)
    ticket_status = models.CharField(max_length=50, db_column="ticket_status")
    resolution = models.CharField(max_length=200, db_column="resolution", null=True, blank=True)
    ticket_priority = models.CharField(max_length=50, db_column="ticket_priority", null=True, blank=True)
    ticket_channel = models.CharField(max_length=50, db_column="ticket_channel", null=True, blank=True)
    first_response_time = models.DurationField(db_column="first_response_time", null=True, blank=True)
    time_to_resolution = models.DurationField(db_column="time_to_resolution", null=True, blank=True)
    customer_satisfaction_rating = models.IntegerField(db_column="customer_satisfaction_rating", null=True, blank=True)

    class Meta:
        managed = False
        db_table = "customer_support_tickets"

class FinalOut(models.Model):
    phone_number = models.CharField(max_length=20, primary_key=True, db_column="phone_number")
    account_length = models.IntegerField(db_column="account_length")
    vmail_message = models.IntegerField(db_column="vmail_message")
    day_mins = models.FloatField(db_column="day_mins")
    day_calls = models.IntegerField(db_column="day_calls")
    day_charge = models.FloatField(db_column="day_charge")
    eve_mins = models.FloatField(db_column="eve_mins")
    eve_calls = models.IntegerField(db_column="eve_calls")
    eve_charge = models.FloatField(db_column="eve_charge")
    night_mins = models.FloatField(db_column="night_mins")
    night_calls = models.IntegerField(db_column="night_calls")
    night_charge = models.FloatField(db_column="night_charge")
    intl_mins = models.FloatField(db_column="intl_mins")
    intl_calls = models.IntegerField(db_column="intl_calls")
    intl_charge = models.FloatField(db_column="intl_charge")
    custserv_calls = models.IntegerField(db_column="custserv_calls")
    churn_prediction = models.IntegerField(db_column="churn_prediction")
    usage_category = models.IntegerField(db_column="usage_category")
    churn_probability = models.FloatField(db_column="churn_probability")
    recommended_products = models.TextField(db_column="recommended_products")
    top_10_features = models.TextField(db_column="top_10_features")
    tenure = models.IntegerField(db_column="tenure")

    class Meta:
        managed = False
        db_table = "final_out"
