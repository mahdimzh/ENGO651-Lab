# ENGO651 - Final Project
## Mahdi Mohammadizadeh (30175778)
## Hadi Aghazadeh (30181045)

# Route Recommendations App based on Extreme Weather and Gas Emissions
This project is a web application that provides personalized route recommendations for truck drivers. It considers the user's subjective goals and factors in extreme weather and gas emissions to offer optimal route recommendations.

# Why are Route Recommendations Important?
Route recommendations are essential because they help us find the best route to reach our destination, personalized to our goals. Traditional route recommendations based on shortest distance or fastest time may not consider subjective criteria, leading to suboptimal choices. Therefore, a personalized approach to route recommendations takes into account the user's goals and considers factors such as weather and gas emissions to provide optimal recommendations.

# Importance of Considering Extreme Weather
Extreme weather conditions can significantly impact Canada's roadways and transportation system, causing travel disruptions, car accidents, and increased maintenance costs. As climate change increases the frequency and severity of such weather events, it is crucial to prepare accordingly to stay safe on the road.

# The Impact of Greenhouse Gas Emissions
The transportation sector accounts for about a quarter of Canada's greenhouse gas emissions, with passenger vehicles contributing a significant amount. To reduce emissions, we need to encourage the use of low-emission vehicles and roads, invest in public transportation infrastructure and consider gas emissions in route recommendations.

# AI-Powered Recommendations
AI-powered route recommendations can analyze various data sources such as traffic and weather data and user preferences to provide optimal route recommendations. It can learn from each user's behavior and preferences, make personalized recommendations and adjust them in real-time based on changing conditions. It can also anticipate users' needs and suggest the best routes and modes of transportation based on their profile and past travel behavior.

# Web Application Features
The web application for this project allows users to plan truck routes with three different options: distance, extreme weather, and gas emissions. Users rate each option based on their importance, and the AI model provides route recommendations based on the combination of these ratings. The results are presented in a visually intuitive manner that enables users to quickly and easily compare different routes and decide which one to choose.



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

`npm install  --legacy-peer-deps`

`yarn dev`


# To access the application:
Access the website at `http://localhost:5173` in your browser. 

# To access the phpmyadmin:
Access the website at `http://localhost:5050` in your browser. 


Contributions 

Contributions are welcome! Feel free to open an issue or submit a pull request. 

