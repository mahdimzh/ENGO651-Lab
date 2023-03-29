# ENGO651 - Lab 6 Assignment
## Mahdi Mohammadizadeh (30175778)
## Hadi Aghazadeh (30181045)

# Web mapping application to draw a polygone and edit it.

## Overview 
The objective of lab 6 assignment is to:

- Draw a polyline on the map by clicking and dragging.

- Click the "Simplify" button to simplify the drawn polyline.

- Click the "Clear" button to remove the drawn polyline from the map and draw a new polyline.

This project aims to provide an understanding of line simplification in web mapping applications by using Turf.js. Users will be able to draw a polyline on the map, and when they click on the "simplify button," a simplified version of the polyline will be displayed in a different color.


## Technologies Used 

- Django 

- React 

- MySQL 

- Docker 

- Git 

- Leaflet.js

- Turf.js


## Features

- Users are able to draw an aribtrary polygones
- A simplifed version of that polygone can be shown based on user preference
- Users can edit the polygone, and simplified version will be updated accordingly
- Users are able to draw multi polygones at the same time and their simplified version will be shown to them
- Users can delete the polygone and the change will be apply online

## Components 

The project has the following apps and components: 

- BackEnd: app (DjangoApp) 
    - building-permit: This is the main app that handle accessing to the building permit api and let the users to query and filter. 

    - core: Handle authentication, user registration and etc at the server side 

- FrontEnd: app-ui (React): 

    - React framework: Main framework 

    - Material-ui: Graphical elements of UI 

    - React-admin: It adds several react requirements such as Redux, Store and etc. It also helps us to implement authentication on the client side. 
    
    - Leaflet.js: The JavaScript library for interactive maps. Leaflet is one of the most popular web mapping APIs.
    
    - Turf.js: Turf.js is a JavaScript library for spatial analysis and geospatial data processing. It provides a wide range of functions for working with geographic data, including geospatial operations, such as buffering, intersecting, and simplifying, as well as more advanced analytics, such as clustering and spatial joins.

-   Docker: For deployment, a docker compose file has been created that has all the necessary requirements to deploy the app. 

-   PhpMyAdming: To access the db and tables. 

# Deployment 

The project has been dockerized for easy deployment. To run the project, you need to have Docker installed on your machine. 

Clone the repository: 


`git clone git@github.com:mahdimzh/ENGO651-Lab.git `


Navigate to the project directory: 

`cd <repo-name> `

For the first time, we must create database.

`cd app`

`python manage.py migrate`

`python manage.py seed_book`


Build the Docker image: 
At the moment the app and app-ui can not be start using docker. We use docker only for MySQL and PhpMyAdmin: 

To start DB:

`docker compose up -d`

To start the app:

`cd app`

`python manage.py runserver`

To start the app-ui:

`cd app-ui`

`npm install`

`yarn dev`


# To access the application:
Access the website at `http://localhost:5173` in your browser. 

# To access the phpmyadmin:
Access the website at `http://localhost:5050` in your browser. 


Contributions 

Contributions are welcome! Feel free to open an issue or submit a pull request. 

