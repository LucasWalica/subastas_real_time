#!bin/bash

echo "esperando a la base de datos...."
while ! nc -z db 5432; do 
    sleep 1 
done 
echo "Base de datos disponible" 


python manage.py makemigrations
python manage.py migrate 
python manage.py collectstatic --noinput 


echo "Creando superusuario si no existe..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
username = 'admin'
email = 'admin@example.com'
password = 'adminpass'
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
"

exec daphne -b 0.0.0.0 -p 8000 core.asgi:application