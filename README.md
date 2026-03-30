
# Task Management System

A full-stack task management application that supports full CRUD operations — create, read, update, and delete tasks — with a React TypeScript frontend and a Spring Boot backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [TaskTable Component](#tasktable-component)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [AI Tools Usage](#ai-tools-usage)
- [Critical Reflection on AI Usage](#critical-reflection-on-ai-usage)

---

## Features

- View all tasks loaded automatically on page mount
- Add a new task using the always-visible form
- Edit any task — form pre-fills with existing data
- Delete any task with a confirmation prompt
- Change task status inline directly from the table
- Input validation with character limits and required field checks
- User-friendly dismissible error banners for API failures

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript |
| Backend | Spring Boot (Java) |
| API | REST over HTTP |
| Styling | Inline CSS (no external library) |

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Niharikabandaru-coder/JavaReactApplication.git
cd your-repo
```
### Backend

### 2. Configure Database

Update `application.yaml`:

```properties
 datasource:
    url: jdbc:h2:mem:taskdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
 h2:
    console:
      enabled: true
      path: /h2-console
```
h2-console access : http://localhost:8080/h2-console
---

### 3. Build the project

```bash
mvn clean install
```

---

### 4. Run the Backend

```bash
mvn spring-boot:run
```

Or run the main class:

```
TaskmanagementApplication.java
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
## Key Points
* Added Swagger documentation (http://localhost:8080/swagger-ui.html) an interactive UI for testing api

---
### Frontend

## Prerequisites

- Backend API running at `http://localhost:8080`
- React with TypeScript

## API Endpoints Expected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Available Scripts

In the project directory frontend/react-app , you can run:

### `npm install` or `npm ci`

Installs the dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

---

## TaskTable Component

A React component for managing tasks with full CRUD operations.

### Usage

Import and drop the component into any page:
```tsx
import TaskTable from "./components/TaskTable";

function App() {
  return <TaskTable />;
}
```

### Features

- **View tasks** — table loads automatically on mount
- **Add a task** — fill in the form at the top and click *Add Task*
- **Edit a task** — click *Edit* on any row; the form pre-fills with existing data
- **Delete a task** — click *Delete* on any row and confirm the prompt
- **Change status inline** — use the coloured dropdown in the Status column directly from the table
- **Validation** — title is required (max 100 chars), description is optional (max 500 chars)
- **Error handling** — API errors appear in a dismissible banner at the top

### Task Status Values

| Value         | Label |
|------------   |-------|
| `TODO`        | To Do |
| `IN_PROGRESS` | In Progress |
| `DONE`        | Completed |

### Validation Rules

| Field | Rule |
|-------|------|
| Title | Required, max 100 characters |
| Description | Optional, max 500 characters |
| Status | Must be one of: `TODO`, `IN_PROGRESS`, `DONE` |

### Task Status Values

| Value | Display Label | Colour |
|-------|--------------|--------|
| `TODO` | To Do | Blue |
| `IN_PROGRESS` | In Progress | Orange |
| `DONE` | Completed | Green |

---

## AI Tools Usage

This project used **Roo Code** and **GitHub Copilot** as AI assistants during development. Below is a transparent account of where and how each was used.

### Usage 
 * Generated React components and hooks
 * Assisted with state management and API integration
 * Helped debug errors and improve code structure
 * Helped design REST API structure
---


## 👨‍💻 Author

NiharikaBandaru 
GitHub: https://github.com/Niharikabandaru-coder/JavaReactApplication

---
