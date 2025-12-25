# CineVault: Movie Discovery & Favorites

A full-stack movie application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to browse movies, build their personal favorites list, and rent titles, featuring a modern UI and secure user authentication.

## Tech Stack

### Frontend

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing:** [React Router](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Image Upload:** Cloudinary

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Node.js/Express backend API
    ├── models/
    ├── routes/
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB installed locally or a MongoDB Atlas connection string
- Cloudinary account for image uploads

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd movie-rental
    ```

2.  **Install Frontend Dependencies:**

    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ../backend
    npm install
    ```

### Environment Variables

Create `.env` files in both `frontend` and `backend` directories.

**Backend (`backend/.env`):**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (`frontend/.env`):**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Running the Application

1.  **Start the Backend:**

    ```bash
    cd backend
    npm start
    # or for development with nodemon (if installed)
    # npm run dev
    ```

2.  **Start the Frontend:**

    ```bash
    cd frontend
    npm run dev
    ```

3.  Open your browser and navigate to the URL shown in the frontend terminal (usually `http://localhost:5173`).

## Deployment

- **Frontend:** Configured for Vercel (see `vercel.json`).
- **Backend:** Configured for Render (see `render.yaml`).
