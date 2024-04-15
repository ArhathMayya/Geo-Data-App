# Geo-Data-App

Geo-Data App is a web application that allows users to draw shapes on a map based on GeoJSON data, save the drawn shapes as ShapeJSON, and manage user authentication (login and signup).

## Features

- **Draw Shapes**: Users can draw various shapes on the map, including polygons, polylines, circles, and rectangles.
- **Upload GeoJSON**: Users can upload GeoJSON files to display geographical data on the map.
- **Save Shapes**: Users can save the drawn shapes as ShapeJSON data to the server.
- **User Authentication**: Users can sign up for a new account or log in with existing credentials to access the application features.

## Technologies Used

### Frontend
- **React**: Frontend framework for building the user interface.
- **Redux**: State management library for managing application state.
- **Leaflet**: JavaScript library for interactive maps.
- **Material-UI**: React component library for UI design.
- **Axios**: Promise-based HTTP client for making API requests.

### Backend
- **Gin**: Web framework for handling HTTP requests.
- **PostgreSQL**: Relational database for storing user data and ShapeJSON and GeoJSON.


## Installation

### Frontend

1. Navigate back to the project root directory:
    ```
    cd ..
    ```
2. Navigate to the frontend directory:
    ```
    cd frontend
    ```
3. Install project dependencies using npm:
    ```
    npm install
    ```
4. Start the frontend application:
    ```
    npm start
    ```

### Backend
1. Navigate back to the project root directory:
    ```
    cd ..
    ```
2. Navigate to the server directory:
    ```
    cd server
    ```
3. Install project dependencies:
    ```
    go mod tidy
    ```
4. Start the backend application:
    ```
    go run main.go

