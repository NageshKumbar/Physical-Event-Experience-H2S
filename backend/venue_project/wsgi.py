import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'venue_project.settings')
application = get_wsgi_application()

try:
    from django.core.management import call_command
    from django.db.utils import OperationalError
    from api.models import Event
    import seed_data
    
    # Render Ephemeral PaaS Hack: Rebuilds from scratch if tables or entries are wiped
    try:
        if not Event.objects.exists():
            seed_data.seed()
    except OperationalError:
        call_command('migrate', interactive=False)
        seed_data.seed()
except Exception as e:
    pass
