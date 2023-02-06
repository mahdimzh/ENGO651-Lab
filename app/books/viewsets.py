from .serializers import BookSerializer
from .models import Book
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db import connection
from django.http import JsonResponse
import json

class ExamplePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class BookViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = BookSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['updated']
    ordering = ['-updated']
    queryset = Book.objects.all()

    pagination_class = ExamplePagination

    def get_queryset(self):
        return self.queryset

    def list(self, request):
        # queryset = self.get_queryset()
        # page = self.paginate_queryset(self.queryset)
        filters = self.request.query_params.get('filter', '')
        filters = json.loads(filters)

        title_term = filters['title']
        isbn_term = filters['isbn']
        author_term = filters['author']
        
        # queryset = self.get_queryset().filter(title__contains=title_term).filter(isbn__contains=isbn_term).filter(author__contains=author_term)
        # serializer = self.serializer_class(queryset, many=True)
        # return Response(serializer.data)

        res = []
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM books_book WHERE title LIKE %s AND isbn LIKE %s AND author LIKE %s",
                       ['%' + title_term + '%', '%' + isbn_term + '%', '%' + author_term + '%'])

            rows = cursor.fetchall()
            for row in rows:
                res.append({'id': row[0], 'isbn': row[1], 'name': row[2], 'author': row[3], 'year': row[4]})

        return JsonResponse({'data': res})




    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]

        obj = Book.objects.get(id=lookup_field_value)
        self.check_object_permissions(self.request, obj)

        return obj
