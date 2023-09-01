from django.db import models
from core.user.models import User

# Create your models here.
class PavementCrack(models.Model):
    # isbn,title,author,year

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, to_field='id', on_delete=models.CASCADE, null=True)

    lat = models.FloatField()
    long = models.FloatField()

    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=0)

    inspection_date = models.DateTimeField(null=True)
    repair_date = models.DateTimeField(null=True)

    repair_type = models.IntegerField(null=True, default=0)

    d00 = models.IntegerField(default=0)
    d10 = models.IntegerField(default=0)
    d20 = models.IntegerField(default=0)
    d40 = models.IntegerField(default=0)

    image = models.ImageField(upload_to='images/', null=True, blank=True)

    def _str_(self):
        return f"Latitude: {self.lat}, Longitude: {self.long}"
