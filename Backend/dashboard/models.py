from django.db import models

class CdrData(models.Model):
    phone_number = models.CharField(max_length=20, primary_key=True)
    account_length = models.IntegerField()
    vmail_message = models.IntegerField()
    day_mins = models.FloatField()
    day_calls = models.IntegerField()
    day_charge = models.FloatField()
    eve_mins = models.FloatField()
    eve_calls = models.IntegerField()
    eve_charge = models.FloatField()
    night_mins = models.FloatField()
    night_calls = models.IntegerField()
    night_charge = models.FloatField()
    intl_mins = models.FloatField()
    intl_calls = models.IntegerField()
    intl_charge = models.FloatField()
    custserv_calls = models.IntegerField()
    churn = models.CharField(max_length=1)  # 'f' or 't'


class CustomerSupportTicket(models.Model):
    ticket_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_age = models.IntegerField()
    customer_gender = models.CharField(max_length=50)
    product_purchased = models.CharField(max_length=255)
    date_of_purchase = models.DateField()
    ticket_type = models.CharField(max_length=100)
    ticket_subject = models.CharField(max_length=255)
    ticket_description = models.TextField()
    ticket_status = models.CharField(max_length=100)
    resolution = models.TextField(null=True, blank=True)
    ticket_priority = models.CharField(max_length=50)
    ticket_channel = models.CharField(max_length=50)
    first_response_time = models.DateTimeField(null=True, blank=True)
    time_to_resolution = models.DateTimeField(null=True, blank=True)
    customer_satisfaction_rating = models.FloatField(null=True, blank=True)


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

    class Meta:
        managed = False  # important: don’t let Django try to create/migrate this table
        db_table = 'telco_customer_churn'  # match your actual table name in PostgreSQL
