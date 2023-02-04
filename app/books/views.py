from django.shortcuts import render
from .models import Book
from rest_framework import generics
from .serializers import BookSerializer
# from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

# @login_required
class BookList(LoginRequiredMixin, generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer




# def index(request):
#     template_name = 'books/index.html'

#     books = Book.objects.all()

#     # books = Book.objects.get(pk=1)

#     # latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     context = {
#         'books': books,
#     }
#     return render(request, template_name, context)