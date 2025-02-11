# TaskFlow

TaskFlow is a task management application built with a modern tech stack. It provides a user-friendly interface to manage tasks in both list and flow views. The backend is powered by FastAPI and PostgreSQL, while the frontend is built with React, TypeScript, and Vite.

## Tech Stack

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite**: A build tool that aims to provide a faster and leaner development experience for modern web projects.
- **Material-UI**: A popular React UI framework for building responsive and accessible user interfaces.
- **React Flow**: A library for building node-based editors and diagrams.

### Backend
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints.
- **SQLAlchemy**: The Python SQL toolkit and Object-Relational Mapping (ORM) library.
- **PostgreSQL**: A powerful, open-source object-relational database system.

## Setup


### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL
## Getting Started
 
 **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name  
   ```


### Frontend Setup
Navigate to the `frontend` directory:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

### Backend Setup
Navigate to the `backend` directory:
   ```sh
   cd backend
   python -m venv venv
   source venv/bin/activate
   # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

### Database Setup
Set up the PostgreSQL database and update the `DATABASE_URL` in the `.env` file.

### Start the FastAPI Server
  ```sh
  uvicorn main:app --reload
  ```
  ### Access the application:

**Frontend**: Open http://localhost:3000 in your browser.

**Backend API docs**: Open http://localhost:8000/docs to explore the API endpoints.
  
# How to Work with This Project

This project is divided into two main parts: the **frontend** and the **backend**. Below is a guide to help you understand the structure, technologies used, and how to work with the project.

---

## Frontend

The frontend is built with **React** and **TypeScript**. Here are the key details:

- **Main Entry Point**: `src/main.tsx`
- **Main Component**: `src/App.tsx`  
  This component handles the task management logic and UI.
- **UI Libraries**:
  - **Material-UI**: Used for building UI components.
  - **React Flow**: Used for rendering the flow view.

---

## Backend

The backend is built with **FastAPI** and **SQLAlchemy**. Here are the key details:

- **Main Entry Point**: `main.py`
- **API**: The backend provides RESTful API endpoints for managing tasks.
- **Database**: The database models are defined using **SQLAlchemy ORM**.

---

## Why This Tech Stack?

### React and TypeScript
- **React**: Provides a component-based architecture that makes it easy to build and maintain complex user interfaces.
- **TypeScript**: Adds static typing to JavaScript, which helps catch errors early and improves code quality.

### Vite
- **Vite** offers a fast and lean development experience with instant hot module replacement (HMR) and optimized build performance.

### FastAPI
- **FastAPI**: Provides high-performance and automatic interactive API documentation, making it easy to build and test APIs.

### PostgreSQL
- **PostgreSQL**: A robust and reliable database system that supports advanced data types and performance optimization features.  
  It was chosen over MySQL and MongoDB due to its strong ACID compliance, advanced indexing capabilities, and better support for complex queries and data integrity constraints.

---


