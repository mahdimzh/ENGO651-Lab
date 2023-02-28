from rest_framework.routers import SimpleRouter
from core.user.viewsets import UserViewSet
from core.auth.viewsets import LoginViewSet, RegistrationViewSet, RefreshViewSet
# from books.views import BookListCreateAPIView
from books.viewsets import BookViewSet
from book_reviews.viewsets import BookReviewViewSet
from django.urls import include, path
from building_permit.viewsets import BuildingPermitViewSet 


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'auth/login', LoginViewSet, basename='auth-login')
routes.register(r'auth/register', RegistrationViewSet, basename='auth-register')
routes.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'user', UserViewSet, basename='user')

routes.register(r'books', BookViewSet, basename='books')
routes.register(r'comments', BookReviewViewSet, basename='comments')
routes.register(r'building-permits', BuildingPermitViewSet, basename='buildingPermit')

# USER
# routes.register(r'books', BookListCreateAPIView, basename='user')


urlpatterns = [
    *routes.urls,
    # path('books/<int:book_id>/comments/', include(routes.urls)),

]
