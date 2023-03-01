# ENGO651 - Lab 3 Assignment
## Mahdi Mohammadizadeh (30175778)
## Hadi Aghazadeh (30181045)

#

# Web mapping application about building permits in Calgary.

## Overview 
The objective of this assignment is to develop a web mapping application focused on "building permits" in Calgary, which builds on the previous Book Review assignments. Upon logging in, users will notice a new "Building Permit" tab in the dashboard menu. By clicking on the tab, users will be presented with a map of Calgary that is automatically zoomed in. The map displays the total number of building permits in the area. As users zoom in on the map, they can see clusters of building permits, which can be expanded to display individual permit points. By clicking on a point, users can access relevant information about that specific permit. Additionally, users can filter the date range to view permits that were issued within a specific time frame. The date selector widget is accessible by clicking on the filter button. By selecting a particular date range, the total number of permit points on the map will adjust accordingly, displaying only the relevant points. The data for this project is available through the Open Calgary API.


 

## Technologies Used 

- Django 

- React 

- MySQL 

- Docker 

- Git 

- Leaflet.js


## Features 

- Develop a web mapping application for "building permits" in Calgary.
- The assignment builds on previous assignments (Book Review).
- Upon logging in, a new "Building Permit" tab is added to the dashboard menu.
- Clicking on the tab displays a map of Calgary that is automatically zoomed in.
- The map shows the total number of building permits in the area.
- Users can zoom in on the map to see clusters of building permits.
- Each permit point can be viewed separately by clicking on it.
- Relevant information about a specific permit can be accessed by clicking on its point.
- Users can filter the date range to view permits that were issued within a specific time frame.
- The date selector widget is accessible by clicking on the filter button.
- Selecting a particular date range adjusts the total number of permit points on the map accordingly.
- The data for this project is available through the Open Calgary API.

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

-   Docker: For deployment, a docker compose file has been created that has all the necessary requirements to deploy the app. 

-   PhpMyAdming: To access the db and tables. 

# Deployment 

The project has been dockerized for easy deployment. To run the project, you need to have Docker installed on your machine. 

Clone the repository: 


`git clone git@github.com:mahdimzh/ENGO651-Lab1.git `


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

