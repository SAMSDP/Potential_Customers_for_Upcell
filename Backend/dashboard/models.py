from django.db import models


class CdrData(models.Model):
    phone_number = models.CharField(max_length=20, primary_key=True, db_column='phone_number')
    account_length = models.IntegerField(db_column='account_length')
    vmail_message = models.IntegerField(db_column='vmail_message')
    day_mins = models.FloatField(db_column='day_mins')
    day_calls = models.IntegerField(db_column='day_calls')
    day_charge = models.FloatField(db_column='day_charge')
    eve_mins = models.FloatField(db_column='eve_mins')
    eve_calls = models.IntegerField(db_column='eve_calls')
    eve_charge = models.FloatField(db_column='eve_charge')
    night_mins = models.FloatField(db_column='night_mins')
    night_calls = models.IntegerField(db_column='night_calls')
    night_charge = models.FloatField(db_column='night_charge')
    intl_mins = models.FloatField(db_column='intl_mins')
    intl_calls = models.IntegerField(db_column='intl_calls')
    intl_charge = models.FloatField(db_column='intl_charge')
    custserv_calls = models.IntegerField(db_column='custserv_calls')
    churn = models.CharField(max_length=1, db_column='churn')  # 'f' or 't'

    class Meta:
        managed = False
        db_table = 'cdr_data'   # your actual PostgreSQL table name


class CustomerSupportTicket(models.Model):
    ticket_id = models.AutoField(primary_key=True, db_column='ticket_id')
    customer_name = models.CharField(max_length=255, db_column='customer_name')
    customer_email = models.EmailField(db_column='customer_email')
    customer_age = models.IntegerField(db_column='customer_age')
    customer_gender = models.CharField(max_length=50, db_column='customer_gender')
    product_purchased = models.CharField(max_length=255, db_column='product_purchased')
    date_of_purchase = models.DateField(db_column='date_of_purchase')
    ticket_type = models.CharField(max_length=100, db_column='ticket_type')
    ticket_subject = models.CharField(max_length=255, db_column='ticket_subject')
    ticket_description = models.TextField(db_column='ticket_description')
    ticket_status = models.CharField(max_length=100, db_column='ticket_status')
    resolution = models.TextField(null=True, blank=True, db_column='resolution')
    ticket_priority = models.CharField(max_length=50, db_column='ticket_priority')
    ticket_channel = models.CharField(max_length=50, db_column='ticket_channel')
    first_response_time = models.DateTimeField(null=True, blank=True, db_column='first_response_time')
    time_to_resolution = models.DateTimeField(null=True, blank=True, db_column='time_to_resolution')
    customer_satisfaction_rating = models.FloatField(null=True, blank=True, db_column='customer_satisfaction_rating')

    class Meta:
        managed = False
        db_table = 'customer_support_tickets'  # your actual PostgreSQL table name



class TelcoCustomerChurn(models.Model):
    customerid = models.CharField(max_length=50, primary_key=True, db_column='customerid')
    gender = models.CharField(max_length=10, db_column='gender')
    seniorcitizen = models.IntegerField(db_column='seniorcitizen')
    partner = models.CharField(max_length=10, db_column='partner')
    dependents = models.CharField(max_length=10, db_column='dependents')
    tenure = models.IntegerField(db_column='tenure')
    phoneservice = models.CharField(max_length=20, db_column='phoneservice')
    multiplelines = models.CharField(max_length=50, db_column='multiplelines')
    internetservice = models.CharField(max_length=50, db_column='internetservice')
    onlinesecurity = models.CharField(max_length=50, db_column='onlinesecurity')
    onlinebackup = models.CharField(max_length=50, db_column='onlinebackup')
    deviceprotection = models.CharField(max_length=50, db_column='deviceprotection')
    techsupport = models.CharField(max_length=50, db_column='techsupport')
    streamingtv = models.CharField(max_length=50, db_column='streamingtv')
    streamingmovies = models.CharField(max_length=50, db_column='streamingmovies')
    contract = models.CharField(max_length=50, db_column='contract')
    paperlessbilling = models.CharField(max_length=10, db_column='paperlessbilling')
    paymentmethod = models.CharField(max_length=100, db_column='paymentmethod')
    monthlycharges = models.FloatField(db_column='monthlycharges')
    totalcharges = models.FloatField(db_column='totalcharges')
    churn = models.CharField(max_length=10, db_column='churn')  # 'Yes' or 'No'
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        managed = False  # important: don’t let Django try to create/migrate this table
        db_table = 'telco_customer_churn'  # match your actual table name in PostgreSQL

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
    customer_status = models.TextField(db_column="customer_status")
    customer_segment = models.TextField(db_column="customer_segment")
    recommended_products = models.TextField(db_column="recommended_products")
    top_10_features = models.TextField(db_column="top_10_features")
    tenure = models.IntegerField(db_column="tenure")

    class Meta:
        managed = False
        db_table = "final_out"

