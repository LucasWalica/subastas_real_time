# 🚀 Sistema de Subastas en Tiempo Real (Alta Concurrencia)

Desarrollo de un *backend* robusto para una aplicación de subastas, centrado en la **gestión de concurrencia** y el procesamiento de tareas asíncronas. Este proyecto demuestra el manejo de **WebSockets** y la orquestación de servicios para garantizar la integridad de las pujas y el cronometraje preciso.

## ⚙️ Pila Tecnológica (Stack)

Este proyecto utiliza una arquitectura basada en microservicios y *containers* para garantizar la escalabilidad y la robustez en producción:

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Backend Core** | `Python`, `Django` | Framework robusto para la lógica de negocio y API. |
| **Tiempo Real** | `Django Channels`, `Daphne` | Gestión de conexiones persistentes mediante WebSockets para la actualización instantánea de pujas y contadores. |
| **Tareas Asíncronas** | `Celery`, `Redis (Broker)` | Ejecución y gestión de tareas de fondo (ej: notificaciones de fin de subasta o cierres automáticos). |
| **Base de Datos** | `PostgreSQL` | Base de datos relacional escalable y segura para la persistencia de datos críticos. |
| **Orquestación** | `Docker`, `docker-compose` | Despliegue en contenedores para aislar servicios y garantizar un entorno de producción consistente (DevOps). |
| **Frontend** | `Angular` | Aplicación Single Page Application (SPA) para la interfaz de usuario. |

## 📐 Arquitectura y Flujo de Datos

La clave del proyecto es la correcta segregación de responsabilidades:

1.  **Concurrencia (Daphne/Channels):** El cliente se conecta al *Consumer* vía WebSockets para enviar y recibir pujas en tiempo real. Esto desacopla la conexión del *backend* principal de Django.
2.  **Tareas Programadas (Celery/Redis):** Una vez que una subasta finaliza o necesita una actualización crítica, la tarea se lanza a una cola de Redis y Celery se encarga de ejecutarla sin bloquear la aplicación web.
3.  **Base de Datos (PostgreSQL):** PostgreSQL mantiene el estado transaccional de la aplicación.

## ✨ Características Principales

* **Subastas en Tiempo Real:** Las pujas se reflejan en la interfaz de todos los usuarios conectados instantáneamente.
* **Gestión de Tiempos:** Uso de tareas asíncronas para el cierre automático y preciso de las subastas temporizadas.
* **Ambiente de Producción:** Preparado para despliegue en contenedores Docker (producción/staging).

## 🐳 Despliegue con Docker

Para levantar la aplicación en un entorno local de desarrollo o testing, utiliza el archivo `docker-compose.yml`:

```bash
# 1. Construir imágenes
docker-compose build

# 2. Levantar todos los servicios (Web, BBDD, Redis, Celery)
docker-compose up -d

# 3. Aplicar migraciones y crear superusuario
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
