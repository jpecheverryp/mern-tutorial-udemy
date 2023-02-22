# Places app

## Links


- [Github Repo](https://github.com/jpecheverryp/mern-tutorial-udemy)
- [Live Website](https://jpe-places.netlify.app/)
- [My portfolio](https://juanpecheverry.com/)

## Description

YourPlaces is a web application that I developed while following a MERN crash course in Udemy.

Users can create a profile with their name, email, password and profile picture.

Users can then add places where they have been or they’d like to visit someday, they can also see what others users have posted, edit their own places and delete them.

The app also uses the Google maps API to get places addresses and to show the places in a map.

## Installation / setup

You can clone this repository if you’d like to contribute to it or if you want to have a local version for development.

The project has two main directories, frontend and backend.

To run the project you would go to the backend directory and install the necessary dependencies.

```jsx
cd backend
npm install
```

After installing them you will need to set up your environment variables by creating a .env file using the .env.example as a template. 

You can then run the backend server on developer mode using the command:

```jsx
npm run start:dev
```

You can also run the backend server on production mode using the command:

```jsx
npm run start
```

For the frontend you can go to the directory and install the dependencies by running the commands: 

```jsx
cd frontend
npm run start
```

You can build your production bundle with: 

```jsx
npm run build
```

## MERN Stack

The chosen stack for the app was the MERN stack that uses the popular technologies: 

- MongoDB (add links to docs)
- Express
- React
- Node

These technologies work really great together and are really easy to use because they all work with JavaScript 

## Frontend

The frontend of the app is built with React the JavaScript framework developed by Meta. It fetches the data from the backend by making an API call and then it stores it on state and displays it.

## Backend server

The backend was developed using Node, a JavaScript runtime that runs in the server it is responsible for receiving api calls, manipulating data and returning information back to the client.

## REST API

The app uses Express, a Node framework to make REST APIs easier to develop by giving the developer with middleware functions

## Database

MongoDB was the chosen database for this project, it is a NoSQL database really easy to set up and work with, specially when using a tool like Mongoose to manage it

## File Upload

The images on the project for user profiles and places are stored on disk, the app uses Multer on the backend to receive the binary files and then stored them in a directory inside the project, images can probably be saved in an external service but I decided to keep it simple on this project

## Auth

The authentication and authorization was made from scratch, passwords are encrypted and instead of sessions it uses JWT or JSON web tokens, this tokens are created with a secret code on the backend and it contains user data such as the email and id.

## Deployment

The backend is deployed on [Render.com](https://render.com/)

The frontend is deployed on [Netlify](https://www.netlify.com/)

The repository is available on [GitHub](https://github.com/jpecheverryp/mern-tutorial-udemy)
