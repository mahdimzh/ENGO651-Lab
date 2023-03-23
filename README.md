# ENGO651 - Lab 5 Assignment
## Mahdi Mohammadizadeh (30175778)
## Hadi Aghazadeh (30181045)

# Web mapping application to turn any smartphone into an IoT sensor.

## Overview 
The objective of lab 5 assignment is to:

- Turn any smartphone into an IoT sensor

- Build a simple web mapping application

- Visualize the location of the smartphone sensor. 

##MQTT
MQTT stands for Message Queuing Telemetry Transport which is known as one of the most used protocols in IoT networks. MQTT is designed to enable Machine to Machine communication in a publish/subscribe architecture. You will no longer need to stack your messages in the queue and wait for a response to send other messages to a server. MQTT is a lightweight protocol that can work in low-bandwidth networks as well as networks with various latency levels. One of the most popular applications of MQTT is to get the latest changes in devices/sensors' status and visualize them on a web client application. In this project, we get the latest location of mobile device by MQTT protocol and visualize it on the map.


## Technologies Used 

- Django 

- React 

- MySQL 

- Docker 

- Git 

- Leaflet.js

- MQTT


## Features

- Users are able to determine the MQTT message broker host and port
- The web application have a Start/End button to establish/finish a connection with the MQTT message broker
- If the user pushed the start button, he would no longer be able to determine host and port values unless he/she clicks on the End button.
- In case of disconnection, users should receive a proper message and the web application should automatically re-establish the connection.
- Users should be able to publish any messages to any topics they want and you should show in your demo if MQTTX can subscribe to the topic and read the message that users have just published.
- You should include the “share my status” button in your app. When a user pushes the button, a Geojson message is generated. The Geojson includes your current location and a random value for the temperature.

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
    
    - MQTT: MQTT stands for Message Queuing Telemetry Transport which is known as one of the most used protocols in IoT networks.

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

