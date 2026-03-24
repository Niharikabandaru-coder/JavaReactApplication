# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


# 🚀 Spring Boot Application

## 📌 Overview

This is a Java-based backend application built using **Spring Boot**. It provides RESTful APIs for managing resources and demonstrates best practices for building scalable applications.

---

## 🛠️ Tech Stack

* Java 17+
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven
* H2

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Niharikabandaru-coder/JavaReactApplication.git
cd your-repo
```

### 2. Configure Database

Update `application.yaml`:

```properties
 datasource:
    url: jdbc:h2:mem:taskdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
```

---

### 3. Build the project

```bash
mvn clean install
```

---

### 4. Run the application

```bash
mvn spring-boot:run
```

Or run the main class:

```
Application.java
```

---

## 🌐 API Endpoints

| Method | Endpoint        | Description     |
| ------ | --------------- | --------------- |
| GET    | /api/tasks      | Get all tasks   |
| GET    | /api/tasks/{id} | Get task by ID  |
| POST   | /api/tasks      | Create new task |
| PUT    | /api/tasks/{id} | Update task     |
| DELETE | /api/tasks/{id} | Delete task     |

---

## 📥 Example Request

### Create User

 
curl -v http://localhost:8080/api/tasks
 
---

## 📤 Example Response

```json
[
  {
    "id": 1,
    "title": "Complete Project Setup",
    "description": "Set up Spring Boot project with H2 database and Flyway",
    "status": "DONE",
    "dueDate": "2026-03-10",
    "createdAt": "2026-03-24T14:58:19.609093",
    "updatedAt": "2026-03-24T14:58:19.609093"
  }
]
```

---

## 🧩 Features

* RESTful APIs
* Layered architecture (Controller, Service, Repository)
* Database integration
* Exception handling
* Validation support

---

## 👨‍💻 Author

NiharikaBandaru 
GitHub: https://github.com/Niharikabandaru-coder/JavaReactApplication

---
