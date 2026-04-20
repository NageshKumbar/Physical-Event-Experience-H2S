import os
import django
from datetime import datetime, timedelta
import pytz

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'venue_project.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Zone, ServicePoint, VirtualQueue, Alert, AttendeeProfile, Event, Order

def seed():
    # Clear existing data
    Event.objects.all().delete()
    Zone.objects.all().delete()
    User.objects.all().delete()
    
    # Create Demo User
    demo_user = User.objects.create_user(username='demo', email='demo@example.com', password='password123', first_name='V', last_name='Silverhand')
    AttendeeProfile.objects.create(user=demo_user, membership_level='Edgerunner VIP')
    
    # Create Cyberpunk Events
    now = datetime.now(pytz.UTC)
    e1 = Event.objects.create(
        title='Neon City Syndicate Festival',
        description='The ultimate underground techno-synth experience. Cybernetic enhancements permitted.',
        date=now + timedelta(days=2),
        venue_name='Sector 4 Power Plant',
        hero_image_url='https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop'
    )
    
    e2 = Event.objects.create(
        title='Night City Hackathon / Expo',
        description='Annual tech expo featuring netrunner competitions and stealth tech.',
        date=now + timedelta(days=15),
        venue_name='Arasaka Tower Convention',
        hero_image_url='https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1200&auto=format&fit=crop'
    )
    
    # Create Zones for Event 1
    z1 = Zone.objects.create(name='Neon Grid Block A', density_level='safe', event=e1)
    z2 = Zone.objects.create(name='Alleyways Block B', density_level='warn', event=e1)
    z3 = Zone.objects.create(name='Main Synth Stage', density_level='danger', event=e1)
    
    # Create Service Points
    s1 = ServicePoint.objects.create(name='Syntax Noodle Bar', service_type='food', zone=z1, distance_ft=120)
    s2 = ServicePoint.objects.create(name='Glitch Energy Drinks', service_type='food', zone=z2, distance_ft=45)
    s3 = ServicePoint.objects.create(name='Cyberware Upgrades Kiosk', service_type='merch', zone=z3, distance_ft=300)
    s4 = ServicePoint.objects.create(name='Underground Restroom', service_type='restroom', zone=z2, distance_ft=10)
    
    # Create Virtual Queues
    VirtualQueue.objects.create(service_point=s1, estimated_wait_time=15, active_orders=5)
    VirtualQueue.objects.create(service_point=s2, estimated_wait_time=5, active_orders=1)
    VirtualQueue.objects.create(service_point=s3, estimated_wait_time=25, active_orders=12)
    
    # Seed historical orders for the Demo user
    Order.objects.create(user=demo_user, event=e1, order_type='ticket', total_price=120.00, status='confirmed')
    Order.objects.create(user=demo_user, service_point=s1, event=e1, order_type='food', total_price=15.50, status='completed')
    
    # Create initial alert
    Alert.objects.create(event=e1, zone=z2, message="WARNING: NCPD activity detected in Alleyways Block B. Expect heavy congestion. Use alternative routing through the Main Synth Stage.")

    print("CYBERPUNK DB SEEDED: Successfully populated Events, Places, Users, and Orders.")

if __name__ == '__main__':
    seed()
