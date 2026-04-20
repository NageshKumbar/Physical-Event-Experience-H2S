from django.db import models
from django.contrib.auth.models import User

class AttendeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    membership_level = models.CharField(max_length=50, default='Standard Member')
    
    def __str__(self):
        return f"Profile for {self.user.username}"

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    venue_name = models.CharField(max_length=200)
    hero_image_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.title

class Zone(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='zones', null=True, blank=True)
    name = models.CharField(max_length=100)
    density_level = models.CharField(max_length=20, choices=[
        ('safe', 'Safe'),
        ('warn', 'Warning'),
        ('danger', 'Danger')
    ], default='safe')
    
    def __str__(self):
        return f"{self.name}"

class ServicePoint(models.Model):
    name = models.CharField(max_length=100)
    service_type = models.CharField(max_length=50, choices=[
        ('food', 'Food/Beverage'),
        ('merch', 'Merchandise'),
        ('restroom', 'Restroom'),
        ('exit', 'Exit')
    ])
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='service_points')
    distance_ft = models.IntegerField(default=100)
    
    def __str__(self):
        return f"{self.name} ({self.service_type})"

class VirtualQueue(models.Model):
    service_point = models.OneToOneField(ServicePoint, on_delete=models.CASCADE)
    estimated_wait_time = models.IntegerField(help_text="Est wait time in minutes")
    active_orders = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Queue for {self.service_point.name}"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    service_point = models.ForeignKey(ServicePoint, on_delete=models.CASCADE, null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    order_type = models.CharField(max_length=50, choices=[('ticket', 'Event Ticket'), ('food', 'Food/Drink'), ('merch', 'Merchandise')])
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=50, default='completed')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Order {self.id} for {self.user.username}"

class Alert(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Alert: {self.message[:20]}..."
