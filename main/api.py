from django.views.decorators.csrf import csrf_exempt , csrf_protect
from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework.parsers import JSONParser , FormParser , MultiPartParser
from rest_framework.decorators import parser_classes
from .models import *
from django.contrib.auth import login, logout , authenticate
from datetime import datetime
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import random
import string

from background_task.models import Task

ch_ly = get_channel_layer()

@csrf_protect
def task_payment(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        payment_obj = payment_info.objects.filter(id = int(data["payment_id"]) )[0]
        payment_obj.user_payment_status = "success"
        payment_obj.save()
        return JsonResponse({"cause": "", "data":"successfull payment", "code": 200, "detail": "operation successful"}, safe=False)
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)
    

@csrf_exempt
def log_in(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        username = data['username']
        password = data['password']
        if data['username'] and data['password']:
            user = authenticate(username=data[
                'username'], password=data['password'])
            if user:
                login(request, user)
                return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "successful login"}, safe=False)
            else:
                return JsonResponse({"cause": "invalid creadential", "data": "", "code": 404, "detail": "user not found"}, safe=False)
        else:
            return JsonResponse({"cause": "", "data": "", "code": 406, "detail": "please fill valid data"}, safe=False)
        
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        username = data['username']
        password = data['password']
        email = data['email']
        mobile = data['mobile']
        address = data['address']
        pincode = data['pincode']
        if username and password and email and mobile and address and pincode:
            user_obj = User.objects.filter(username = username)
            if len(user_obj) > 0:
                return JsonResponse({"cause": "invalid creadential", "data": "", "code": 404, "detail": "username already exist"}, safe=False)
            else:
                user_obj = User.objects.create(username=username , email=email)
                user_obj.set_password(password)
                user_obj.save()
                exnted_obj = exntend_user_details.objects.get(user = user_obj)
                exnted_obj.address = address
                exnted_obj.pincode = pincode
                exnted_obj.mobile_number = mobile
                exnted_obj.save()
                return JsonResponse({"cause": "", "data":"", "code": 200, "detail": "successful signup"}, safe=False)
        else:
            return JsonResponse({"cause": "", "data": "", "code": 406, "detail": "please fill valid data"}, safe=False)
        
    else:
        return JsonResponse({"cause": "invalid method", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

@csrf_exempt
def log_out(request):
    if request.method == "POST":
        if str(request.user) != "AnonymousUser":
            logout(request)
            return JsonResponse({"cause": "", "data": "", "code": 200, "detail": "logout successfull"}, safe=False)
        else:
            return JsonResponse({"cause": "", "data": "", "code": 404, "detail": "please login first"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def accept_task(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        panding_task_obj = panding_task.objects.get(id = int(data['panding_id']))
        panding_task_obj.panding_task_agent = request.user
        panding_task_obj.status="accepted"
        panding_task_obj.accept_time =datetime.now()
        panding_task_obj.agent_location = data['agent_location']
        panding_task_obj.save()
        return JsonResponse({"cause": "", "data": "", "code": 200, "detail": "use POST method"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)



@csrf_exempt
def complete_task(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        panding_task_obj = panding_task.objects.filter(id = int(data['panding_id'])).first()
        pandin_id = panding_task_obj.id
        otp = data['otp']
        print(f"complete otp : {panding_task_obj.otp}")
        if panding_task_obj.otp == otp:
            payment_info_obj = panding_task_obj.payment
            payment_info_obj.agent_payment_status = "success"
            payment_info_obj.save()
            print(payment_info_obj)
            return JsonResponse({"cause": "", "data": {'panding_id' : pandin_id}, "code": 200, "detail": "task_completed"}, safe=False)
        else:
            return JsonResponse({"cause": "", "data": "", "code":400, "detail": "invalid otp"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

@csrf_exempt
def cancel_task(request):
    if request.method == "POST":
        data = JSONParser().parse(request, request)
        print(data)
        panding_task_obj = panding_task.objects.filter(id = int(data["panding_id"])).first()
        if panding_task_obj.panding_task_user == request.user:
            panding_id = panding_task_obj.id
            completed_task_obj = completed_task.objects.create(payment = panding_task_obj.payment , task_detail_link=panding_task_obj.task_detail_link , completed_task_user=panding_task_obj.panding_task_user , status="cancelled",refund_status= "panding" , accepted=panding_task_obj.status , accept_time=panding_task_obj.accept_time)
            if panding_task_obj.status == "accepted":
                completed_task_obj.completed_task_agent=panding_task_obj.panding_task_agent

                # here one thing to add when whole project is ready and no other work is left behind
                # work : "int(panding_task_obj.payment.user_payment)*0.7" this refund amount can be vary by the time left to touch the deadline of the task
                refund_obj = refund_detail.objects.create(refund_amount = int(panding_task_obj.payment.user_payment)*0.7)
            elif panding_task_obj.status == "initilize":
                refund_obj = refund_detail.objects.create(refund_amount = int(panding_task_obj.payment.user_payment))
            completed_task_obj.refund_detail = refund_obj
            completed_task_obj.save()
            btask_obj = Task.objects.get(id = int(panding_task_obj.task_expire_id))
            btask_obj.delete()
            panding_task_obj.delete()
            # refund_user()call function when this refund function is ready
            return JsonResponse({"cause" : "" , "data" : {"panding_id" : panding_id} , "code" : 200 , "detail" : "task cancelletion successful"})
        else:
            return JsonResponse({"cause" : "" , "data" : "" , "code" : 400 , "detail" : "You are unauthorized to cancel task"})
    else:
        return JsonResponse({"cause" : "" , "data" : "" , "code" : 405 , "detail" : "Invalid Method."})

@csrf_exempt
def agent_cancel_task(request):
    if request.method == "POST":
        data = JSONParser().parse(request, request)
        print(data)
        panding_task_obj = panding_task.objects.filter(id = int(data["panding_id"])).first()
        if panding_task_obj.panding_task_agent == request.user:
            print(panding_task_obj.otp)
            if panding_task_obj.otp_cancel == data['otp']:
                agent = online.objects.filter(user = panding_task_obj.panding_task_agent , state="agent")  # check if that user is online or not 
                if len(agent) > 0 :  #this true if user found in online table
                    agent = agent.first() 
                    if len(agent.channel_name) > 0:
                        async_to_sync(ch_ly.send)(
                            agent.channel_name,
                            {
                                'type': 'sendevent',
                                'typex' : 'remove_accepted_task',
                                'panding_id': panding_task_obj.id,
                            }
                        )
                owner = online.objects.filter(user = panding_task_obj.panding_task_user , state="user")  # check if that user is online or not 
                if len(owner) > 0 :  #this true if user found in online table
                    owner = owner.first() 
                    if len(owner.channel_name) > 0:
                        async_to_sync(ch_ly.send)(
                            owner.channel_name,
                            {
                                'type': 'sendevent',
                                'typex' : 'remove_accepted_task',
                                'panding_id': panding_task_obj.id,
                            }
                        )
                panding_task_obj.panding_task_agent = None
                panding_task_obj.status = "initilize"
                panding_task_obj.agent_location = ""
                panding_task_obj.accept_time = None
                panding_task_obj.save()
                return JsonResponse({"cause" : "" , "data" : "" , "code" : 200 , "detail" : "task cancelletion successful"})
            else:
                return JsonResponse({"cause" : "" , "data" : "" , "code" : 400 , "detail" : "Invalid otp"})
        else:
            return JsonResponse({"cause" : "" , "data" : "" , "code" : 401 , "detail" : "You are unauthorized to cancel task"})
    else:
        return JsonResponse({"cause" : "" , "data" : "" , "code" : 405 , "detail" : "Invalid Method."})



@csrf_exempt
def remove_agent(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        print(f"received id {int(data['panding_id'])}")
        panding_task_obj = panding_task.objects.filter(id = int(data['panding_id'])).first()
        agent_name = panding_task_obj.panding_task_agent.username

        agent = online.objects.filter(user = panding_task_obj.panding_task_agent , state="agent")  # check if that user is online or not 
        if len(agent) > 0 :  #this true if user found in online table
            agent = agent.first() 
            if len(agent.channel_name) > 0:
                async_to_sync(ch_ly.send)(
                    agent.channel_name,
                    {
                        'type': 'sendevent',
                        'typex' : 'remove_accepted_task',
                        'panding_id': panding_task_obj.id,
                    }
                )

        panding_task_obj.panding_task_agent = None
        panding_task_obj.status = "initilize"
        panding_task_obj.agent_location = ""
        panding_task_obj.accept_time = None
        panding_task_obj.save()
        print(f"sended id {panding_task_obj.id}")
        return JsonResponse({"cause": "", "data": {"agent_name":agent_name,"task_name":panding_task_obj.task_detail_link.name , "panding_id" : panding_task_obj.id }, "code": 200, "detail": "agent removed successfully"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

@csrf_exempt
def generate_otp(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        print(f"received id {int(data['panding_id'])}")
        panding_task_obj = panding_task.objects.filter(id = int(data['panding_id'])).first()
        code = ''.join(random.SystemRandom().choice(
                                    string.ascii_letters + string.digits) for _ in range(7))
        code_cancel = ''.join(random.SystemRandom().choice(
                                    string.ascii_letters + string.digits) for _ in range(7))
        panding_task_obj.otp = code
        panding_task_obj.otp_cancel = code_cancel
        panding_task_obj.save()
        return JsonResponse({"cause": "", "data": {"otp" : code , "otp_cancel_agent" : code_cancel , "panding_id" : panding_task_obj.id}, "code": 200, "detail": "otp generated successful"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)

@csrf_exempt
def get_more_details(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        panding_task_obj = panding_task.objects.filter(id = int(data['panding_id'])).first()
        data = {
        'panding_id' : panding_task_obj.id,
        'name' : panding_task_obj.task_detail_link.name,
        'gender' : panding_task_obj.task_detail_link.gender,
        'address' : panding_task_obj.task_detail_link.address,
        'pincode' : panding_task_obj.task_detail_link.pincode,
        'mobile_number' : panding_task_obj.task_detail_link.mobile_number,
        'deadline' : panding_task_obj.task_detail_link.deadline,
        'gmaplink' : panding_task_obj.task_detail_link.gmaplink,
        'note' : panding_task_obj.task_detail_link.note,
        'image' : str(panding_task_obj.task_detail_link.image),
        'proof' : str(panding_task_obj.task_detail_link.proof),
        'document' : str(panding_task_obj.task_detail_link.document),
        "accepted" : 0,
        }
        if panding_task_obj.panding_task_user == request.user:
            data['payment_status'] = panding_task_obj.payment.user_payment_status
            data['user_bankname'] = panding_task_obj.payment.user_bankname
            data['user_paymentmode'] = panding_task_obj.payment.user_paymentmode
            data['user_txnid'] = panding_task_obj.payment.user_txnid
            data['user_txndate'] = panding_task_obj.payment.user_txndate

        if panding_task_obj.status == "accepted" and panding_task_obj.panding_task_user == request.user:
            data["accepted"] = 1
            data["agent_name"] = panding_task_obj.panding_task_agent.username
            data["accepted_time"] = panding_task_obj.accept_time
            data["agent_mobile"] = panding_task_obj.panding_task_agent.exntend_user_details.mobile_number
            data["agent_image"] = str(panding_task_obj.panding_task_agent.exntend_user_details.image)
            data["agent_xender"] = str(panding_task_obj.panding_task_agent.exntend_user_details.xender)
            data["agent_location"] = str(panding_task_obj.agent_location)

        elif panding_task_obj.status == "accepted" and panding_task_obj.panding_task_agent == request.user:
            data["accepted"] = 1
            data["accepted_time"] = panding_task_obj.accept_time
            data["user_name"] = panding_task_obj.panding_task_user.username
            data["user_mobile"] = panding_task_obj.panding_task_user.exntend_user_details.mobile_number
            data["user_image"] = str(panding_task_obj.panding_task_user.exntend_user_details.image)
            data["user_xender"] = str(panding_task_obj.panding_task_user.exntend_user_details.xender)

        return JsonResponse({"cause": "", "data": data, "code": 200, "detail": "more details grabed."}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)



@csrf_exempt
def complete_task_more_details(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        completed_task_obj = task_detail.objects.filter(id=data['task_id']).first().completed_task
        data = {
        'panding_id' : completed_task_obj.task_detail_link.id,
        'name' : completed_task_obj.task_detail_link.name,
        'gender' : completed_task_obj.task_detail_link.gender,
        'address' : completed_task_obj.task_detail_link.address,
        'pincode' : completed_task_obj.task_detail_link.pincode,
        'deadline' : completed_task_obj.task_detail_link.deadline,
        'completed_time' : completed_task_obj.date,
        'image' : str(completed_task_obj.task_detail_link.image),
        "accepted" : 0,
        'gmaplink' : completed_task_obj.task_detail_link.gmaplink,
        }
        if completed_task_obj.completed_task_user == request.user:
            data['document'] = str(completed_task_obj.task_detail_link.document)
            data['proof'] = str(completed_task_obj.task_detail_link.proof)
            data['note'] = completed_task_obj.task_detail_link.note
            data['mobile_number'] = completed_task_obj.task_detail_link.mobile_number
            data['payment_status'] = completed_task_obj.payment.user_payment_status
            data['user_bankname'] = completed_task_obj.payment.user_bankname
            data['user_paymentmode'] = completed_task_obj.payment.user_paymentmode
            data['user_txnid'] = completed_task_obj.payment.user_txnid
            data['user_txndate'] = completed_task_obj.payment.user_txndate
        # else:
        #     data['document'] = "..."
        #     data['proof'] = "..."
        #     data['note'] = "..."
        #     data['mobile_number'] = "..."


        if completed_task_obj.accepted == "accepted" and completed_task_obj.completed_task_user == request.user:
            data["accepted"] = 1
            data["agent_name"] = completed_task_obj.completed_task_agent.username
            data["accepted_time"] = completed_task_obj.accept_time
            data["agent_mobile"] = completed_task_obj.completed_task_agent.exntend_user_details.mobile_number
            data["agent_image"] = str(completed_task_obj.completed_task_agent.exntend_user_details.image)
            data["agent_xender"] = str(completed_task_obj.completed_task_agent.exntend_user_details.xender)
            # data["agent_location"] = "/#"

        elif completed_task_obj.accepted == "accepted" and completed_task_obj.completed_task_agent == request.user:
            data["accepted"] = 1
            data["accepted_time"] = completed_task_obj.accept_time
            data["user_name"] = completed_task_obj.completed_task_user.username
            data["user_image"] = str(completed_task_obj.completed_task_user.exntend_user_details.image)
            data["user_mobile"] = completed_task_obj.completed_task_user.exntend_user_details.mobile_number
            data["user_gender"] = completed_task_obj.completed_task_user.exntend_user_details.xender
            data["agent_payment_status"] = completed_task_obj.payment.agent_payment_status

        return JsonResponse({"cause": "", "data": data, "code": 200, "detail": " completed task details grabed."}, safe=True)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def delete_task(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        task_obj = task_detail.objects.filter(id = int(data['task_id'])).first()
        task_obj.delete()
        return JsonResponse({"cause": "", "data": "", "code": 200, "detail": "use POST method"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
def contact_us(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        contactobj = contactus.objects.create(first_name=data['first_name'] , last_name= data['last_name'] , email_address=data['email_address'] , mobile_number=data['mobile_number'] , message=data['message'])
        contactobj.save()
        return JsonResponse({"cause": "", "data": "", "code": 200, "detail": "contact recorded successful"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)


@csrf_exempt
@parser_classes([JSONParser, FormParser, MultiPartParser])
def update_task(request):
    if(request.method == "POST"):
        print(request.POST)
        task_detail_obj = panding_task.objects.get(id=int(request.POST['id'])).task_detail_link
        task_detail_obj.mobile_number = int(request.POST['update_task_mobile'])
        task_detail_obj.deadline = request.POST['update_task_deadline']
        task_detail_obj.address = request.POST['update_task_address']
        task_detail_obj.gmaplink = request.POST['update_task_gmap']
        task_detail_obj.note = request.POST['update_task_note']
        if "update_profile_img" in request.FILES:
            task_detail_obj.image = request.FILES['update_profile_img']
        if "update_task_proof" in request.FILES:
            task_detail_obj.image = request.FILES['update_task_proof']
        if "update_task_document" in request.FILES:
            task_detail_obj.image = request.FILES['update_task_document']

        task_detail_obj.save()
        return JsonResponse({"cause": "", "data": {"id": task_detail_obj.panding_task.id}, "code": 200, "detail": "update task successful"}, safe=False)
    else:
        return JsonResponse({"cause": "", "data": "", "code": 405, "detail": "use POST method"}, safe=False)
