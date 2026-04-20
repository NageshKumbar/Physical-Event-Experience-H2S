from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'zones', views.ZoneViewSet)
router.register(r'service-points', views.ServicePointViewSet)
router.register(r'queues', views.QueueViewSet)
router.register(r'alerts', views.AlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
