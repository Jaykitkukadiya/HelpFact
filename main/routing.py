from channels.routing import ProtocolTypeRouter , URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from django.urls import path
from .consumer import expire 

websocket_urlpatterns = [
    path('ws/expire/' , expire.as_asgi()),
]