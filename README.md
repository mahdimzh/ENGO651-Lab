# ENGO651 - Lab 1 Assignment
## Mahdi Mohammadizadeh (30175778)
## Hadi Aghazadeh (30181045)

#

# Book Review Website 

## Overview 

This is a book review website built using Django, React, and MySQL. The website allows users to search books by ISBN, author name, or any other keywords. Users can also select a book and leave a comment or read comments left by others. The website has a signup and sign-in form to authenticate users. 

 

## Technologies Used 

- Django 

- React 

- MySQL 

- Docker 

- Git 


## Features 

- Book database with ISBN, name, author, and other details 

- Search books by ISBN, author name, or any other keywords 

- Leave comments or read comments left by others on a book 

- Signup and sign-in form for user authentication 

## Components 

The project has the following apps and components: 

- BackEnd: app (DjangoApp) 
    - book_reviews: Holds implements and APIs for submitting and receiving comments related to a book 

    - books: Contains APIs related to books and their related data in MySQL 

    - core: Handle authentication, user registration and etc at the server side 

- FrontEnd: app-ui (React): 

    - React framework: Main framework 

    - Material-ui: Graphical elements of UI 

    - React-admin: It adds several react requirements such as Redux, Store and etc. It also helps us to implement authentication on the client side. 

-   Docker: For deployment, a docker compose file has been created that has all the necessary requirements to deploy the app. 

-   PhpMyAdming: To access the db and tables. 

# Deployment 

The project has been dockerized for easy deployment. To run the project, you need to have Docker installed on your machine. 

Clone the repository: 


`git clone https://github.com/<username>/<repo-name>.git `


Navigate to the project directory: 

`cd <repo-name> `

For the first time, we must create database.

`cd app`

`python manage.py migrate`

`python manage.py seed_book`


Build the Docker image: 

`docker compose up -d`


# To access the application:
Access the website at `http://localhost:5173` in your browser. 

# To access the phpmyadmin:
Access the website at `http://localhost:5050` in your browser. 


Contributions 

Contributions are welcome! Feel free to open an issue or submit a pull request. 

