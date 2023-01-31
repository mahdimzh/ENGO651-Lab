from django.core.management.base import BaseCommand
import csv
from books.models import Book
import os

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.

class Command(BaseCommand):
    help = 'Import data from a CSV file into the database'

    def handle(self, *args, **options):
        BASE_DIR = Path(__file__).resolve().parent

        with open(os.path.join(BASE_DIR, "books.csv"), 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                print(row)
                # Convert each row into a model instance
                instance = Book(isbn=row[0], title=row[1], author=row[2], year=row[3])
                # Save the instance to the database
                instance.save()