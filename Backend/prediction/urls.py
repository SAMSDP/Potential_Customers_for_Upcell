from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_file, name='upload_file'),
    path('model_status/<str:job_id>/', views.model_status, name='model_status'),
    path('results/<str:job_id>/', views.pipeline_result, name='pipeline_result'),
]
