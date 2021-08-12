web: daphne Helpfact.asgi:application --port $PORT --bind 0.0.0.0 -v2 
worker: python manage.py runworker process_tasks channel_layer --settings=Helpfact.settings -v2