from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # You can add custom fields here later (e.g., bio, avatar)
    
    class Meta:
        db_table = 'auth_user' # Keeps the standard table name
        
    def __str__(self):
        return self.username