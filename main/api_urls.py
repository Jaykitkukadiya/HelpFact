from .api import *
from django.urls import path

urlpatterns = [
    path("task/payment/" , task_payment),
    path("login/" , log_in),
    path("signup/" , signup),
    path("logout/" , log_out),
    path("task/accept/" , accept_task),
    path("task/remove_agent/" , remove_agent),
    path("task/complete/" , complete_task),
    path("task/cancel/" , cancel_task),
    path("task/agent/cancel/" , agent_cancel_task),
    path("task/complete/getmoredetails/" , complete_task_more_details),
    path("task/getmoredetails/" , get_more_details),
    path("task/update/" , update_task),
    path("task/gotp/" , generate_otp),
    path("task/delete/" , delete_task),
    path("contactus/" , contact_us),
]