from .serializers import BookReivewSerializer
from .models import Review
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db import connection
from django.http import JsonResponse
import json
from rest_framework import status
from rest_framework.decorators import action

class ExamplePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class BookReviewViewSet(viewsets.ModelViewSet):
    # http_method_names = ['get']
    serializer_class = BookReivewSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    # ordering_fields = ['updated']
    # ordering = ['-updated']
    queryset = Review.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    pagination_class = ExamplePagination

    def get_queryset(self):
        return self.queryset

    def list(self, request):
        # queryset = self.get_queryset()
        book_id = None
        filters = self.request.query_params.get('filter', '')
        if filters is not None and filters is not '':
            filters = json.loads(filters)
            book_id = filters['book_id']

        res = []
        with connection.cursor() as cursor: 
            cursor.execute("SELECT brr.id, brr.comment, bb.isbn, bb.title, bb.author, bb.year, cuu.username, cuu.email FROM book_reviews_review brr LEFT JOIN books_book bb ON brr.book_id=bb.id LEFT JOIN core_user_user cuu ON cuu.id =brr.user_id where brr.book_id=%s order by brr.id desc", book_id )

            rows = cursor.fetchall()
            for row in rows:
                res.append({'id': row[0], 'comment': row[1], 'isbn': row[2], 'title': row[3], 'author': row[4], 'year': row[5], 'username': row[6], 'email': row[7]})

        return JsonResponse({'data': res})


    def perform_create(self, serializer): 
        # author_id = self.request.data.get('author') 
        # author = Author.objects.get(id=author_id) 
        # serializer.save(author=author)
        # serializer = self.get_serializer(data=self.request.data)
        # serializer.is_valid(raise_exception=True)
        # serializer.save(data=self.request.data)
        # headers = self.get_success_headers(serializer.data)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)



    def retrieve(self, request, *args, **kwargs):
        book = self.get_object()
        serializer = self.get_serializer(book)
        return Response(serializer.data)

    # def get_object(self):
    #     lookup_field_value = self.kwargs[self.lookup_field]
    #     # obj = Book.objects.get(id=lookup_field_value)
    #     # self.check_object_permissions(self.request, obj)

    #     res = []
    #     with connection.cursor() as cursor:
    #         cursor.execute("SELECT * FROM book_reviews_review WHERE book_id=%s",
    #                    [lookup_field_value])

    #         rows = cursor.fetchall()
    #         for row in rows:
    #             res.append({'id': row[0], 'comment': row[1], 'book_id': row[2], 'user_id': row[3]})


    #     obj = Review.objects.get(id=lookup_field_value)
    #     self.check_object_permissions(self.request, obj)

    #     return obj


        # return JsonResponse({"comment": {'cosdfsdfmment': 'sdfsdf'}})

    @action(detail=False)
    def custom_function(self, request):
        # your custom logic here
        data = {"message": "Hello World"}
        return Response(data)
