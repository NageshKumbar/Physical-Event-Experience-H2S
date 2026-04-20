from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Zone, ServicePoint, VirtualQueue, Alert, AttendeeProfile, Event, Order

class AttendeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendeeProfile
        fields = ['membership_level']

class OrderSerializer(serializers.ModelSerializer):
    service_point_name = serializers.CharField(source='service_point.name', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = AttendeeProfileSerializer()
    orders = OrderSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'profile', 'orders']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        user = User.objects.create_user(**validated_data)
        AttendeeProfile.objects.create(user=user, **profile_data)
        return user
        
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        
        profile.membership_level = profile_data.get('membership_level', profile.membership_level)
        profile.save()
        
        return instance

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'

class VirtualQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualQueue
        fields = '__all__'

class ServicePointSerializer(serializers.ModelSerializer):
    queue = VirtualQueueSerializer(source='virtualqueue', read_only=True)
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    event_id = serializers.IntegerField(source='zone.event.id', read_only=True)
    
    class Meta:
        model = ServicePoint
        fields = ['id', 'name', 'service_type', 'zone_name', 'event_id', 'distance_ft', 'queue']

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'
