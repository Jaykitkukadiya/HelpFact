web: daphne Helpfact.asgi:application --port $PORT --bind 0.0.0.0 -v2 --settings=Helpfact.settings
chatworker: python manage.py process_tasks --settings=Helpfact.settings -v2