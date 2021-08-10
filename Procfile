web: daphne Helpfact.asgi:application --port $PORT --bind 0.0.0.0 -v2 
chatworker: python manage.py runworker channel_layer --settings=Helpfact.settings -v2