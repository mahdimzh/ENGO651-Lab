# ENGO651 - Lab 4 Assignment
## Mahdi Mohammadizadeh (30175778)
## Hadi Aghazadeh (30181045)

#

# Web mapping application about Car accidents in Calgary.

## Overview 
The objective of lab 4 assignment is to:

- Create a Mapbox Vector Tiles and Mapbox Studio.

- Design a visually appealing map layer.

- Integrate a vector tileset to an existing GeoWeb application.

This is an extension for Lab 3 in which we develop a web mapping application focused on "building permits" in Calgary, which builds on the previous Book Review assignments. Upon logging in, users will notice a new "Building Permit" tab in the dashboard menu. By clicking on the tab, users will be presented with a map of Calgary that is automatically zoomed in. The map displays the total number of building permits in the area. As users zoom in on the map, they can see clusters of building permits, which can be expanded to display individual permit points. By clicking on a point, users can access relevant information about that specific permit. Additionally, users can filter the date range to view permits that were issued within a specific time frame. The date selector widget is accessible by clicking on the filter button. By selecting a particular date range, the total number of permit points on the map will adjust accordingly, displaying only the relevant points. The data for this project is available through the Open Calgary API.

For lab 4, we mash up a styled vector tileset hosted on Mapbox with a web mapping application developed in the lab 3. Users are able to load and visualize a different map layer (e.g., a Mapbox style) from our Mapbox account. They can use Mapbox to design and publish the map layer. Users also are able to toggle on and off the new layer based on their choice and preference.


 

## Technologies Used 

- Django 

- React 

- MySQL 

- Docker 

- Git 

- Leaflet.js

- MapBox


## Features 

- Develop a web mapping application for "car accident" in Calgary.
- The assignment builds on previous assignments (Building Premits).
- Upon logging in, a new "Map Layer" tab is added to the dashboard menu.
- Calgary car accident data is turned into a map layer in mapbox
- Users should be able to toggle on/off the map layer when visiting the site.
- A visually appealing map layer is design in which main roads has a deep red, main streets has a middle red and narrow alleys are shown with ligh red. The background color is also ligh blue.
- Due to the fact that most of the accidents have happend in main roads and streets, narrow alleys are also blured and their opacity is reduced to help users focus on the main goal of this project which is car accidents in calgary.
- There are two layers (Basic openstreetmap layer, and customized layer)
- New customized icon is used to show the car accidents in a more appealing way

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
    
    - MapBox: Mapbox is a platform that provides mapping and location-based services. It offers developers tools for creating custom maps, geocoding and routing, and integrating location-based features into applications. Mapbox also provides map data, which can be used to create custom maps and visualizations.

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

