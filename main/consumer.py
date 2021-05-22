from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from .models import *
from channels.db import database_sync_to_async
import json
from asgiref.sync import async_to_sync ,sync_to_async
from django.contrib.auth.models import User


class expire(WebsocketConsumer):

    def offline(self):
        onlineobj = online.objects.all().filter(user = self.scope['user']).first()
        if onlineobj.channel_name == self.channel_name:
            onlineobj.delete()

    def connect(self):
        self.accept()
        user = self.scope["user"]
        self.group_name = 'grp_%s' % user.exntend_user_details.pincode
    


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )
        self.offline()


    def receive(self, text_data):
        if text_data in ["user","agent"]:
            user = self.scope["user"]
            print(text_data)

            # below code will help to use parallel screen
            
            # onlineobj , onlineobj_cre = online.objects.get_or_create(user=user , channel_name=self.channel_name , state=text_data)
            # if onlineobj_cre:
            #     onlineobj.save()
            # else:
            #     onlineobj.delete()
            #     onlineobj = online.objects.create(user=user , channel_name=self.channel_name , state=text_data)
            #     onlineobj.save()

            # below code is usefull for only one screen if other screen is opened then first not work means notifications and other will not work at same time

            if len(online.objects.filter(user = user)) > 0 :
                for online_obj in online.objects.filter(user = user):
                    online_obj.delete()
                onlineobj = online.objects.create(user=user , channel_name=self.channel_name , state=text_data)
                onlineobj.save()
            else:
                onlineobj = online.objects.create(user=user , channel_name=self.channel_name , state=text_data)
                onlineobj.save()


            if text_data == "agent":
                async_to_sync(self.channel_layer.group_add)(
                    self.group_name,
                    self.channel_name
                )
            # print(self.channel_name)
        elif text_data == "ping":
            # print(self.scope['user'])

            exist_chname = online.objects.all().filter(user = self.scope['user']).first().channel_name
            if exist_chname != self.channel_name:
                # print(online.objects.all().filter(user = self.scope['user']).first().channel_name)
                # print(self.channel_name)
                async_to_sync(self.channel_layer.send)(
                    self.channel_name,
                    {
                        'type': 'sendevent',
                        'typex' : 'session_expire',
                        'detail' : 'you are no longer available in this window'
                    }
                )

            


    def sendevent(self , event):
        # print("online")
        self.send(text_data=json.dumps(
            event
        ))
        # print("onlinefinish")
