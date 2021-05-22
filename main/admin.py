from django.contrib import admin
from .models import contactus,refund_detail,exntend_user_details,task_detail,panding_task,completed_task,payment_info,task_notification , online

# Register your models here.

admin.site.register(exntend_user_details)
admin.site.register(online)
admin.site.register(task_detail)
admin.site.register(panding_task)
admin.site.register(completed_task)
admin.site.register(payment_info)
admin.site.register(task_notification)
admin.site.register(contactus)
admin.site.register(refund_detail)