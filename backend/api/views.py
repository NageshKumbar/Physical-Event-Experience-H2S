from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Zone, ServicePoint, VirtualQueue, Alert, Event, Order
from .serializers import ZoneSerializer, ServicePointSerializer, VirtualQueueSerializer, AlertSerializer, UserSerializer, EventSerializer, OrderSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
        
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        event_id = self.request.query_params.get('event')
        if event_id is not None:
            queryset = queryset.filter(event_id=event_id)
        return queryset

class ServicePointViewSet(viewsets.ModelViewSet):
    queryset = ServicePoint.objects.all()
    serializer_class = ServicePointSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        event_id = self.request.query_params.get('event')
        if event_id is not None:
            queryset = queryset.filter(zone__event_id=event_id)
        return queryset

class QueueViewSet(viewsets.ModelViewSet):
    queryset = VirtualQueue.objects.all()
    serializer_class = VirtualQueueSerializer
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        queue = self.get_object()
        queue.active_orders += 1
        queue.estimated_wait_time += 1
        queue.save()
        # Optionally create an Order record for tracking!
        if request.user.is_authenticated:
            Order.objects.create(
                user=request.user,
                service_point=queue.service_point,
                order_type='food',
                total_price=15.00,
                status='preparing'
            )
            
        return Response({'status': 'queue joined', 'estimated_wait_time': queue.estimated_wait_time})

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-created_at')
    serializer_class = AlertSerializer
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        active_alerts = Alert.objects.filter(is_active=True)
        event_id = request.query_params.get('event')
        if event_id:
            active_alerts = active_alerts.filter(event_id=event_id)
        serializer = self.get_serializer(active_alerts, many=True)
        return Response(serializer.data)
