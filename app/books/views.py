from django.shortcuts import render
from .models import Book

def index(request):
    template_name = 'books/index.html'

    books = Book.objects.all()

    # books = Book.objects.get(pk=1)

    # latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {
        'books': books,
    }
    return render(request, template_name, context)