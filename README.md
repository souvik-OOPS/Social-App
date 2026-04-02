# MERN Social App

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to share posts, interact with other users, and manage their social connections.

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication with login and signup
- **Post Management**: Create, read, and manage posts
- **Comments & Interactions**: Comment on posts and engage with other users
- **Image Upload**: Seamless image uploads powered by Cloudinary
- **User Profiles**: View and manage user profiles
- **Responsive Design**: Mobile-friendly interface built with React
- **State Management**: Centralized state management with Redux Toolkit

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB with Mongoose (v9.3.3)
- **Authentication**: JWT (jsonwebtoken) & bcryptjs
- **File Upload**: Multer & Cloudinary
- **Utilities**: Cookie-parser, CORS, dotenv

### Frontend

- **Framework**: React (v19.2.4)
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (v2.11.2)
- **HTTP Client**: Axios
- **Routing**: React Router DOM (v7.13.2)
- **UI Icons**: Lucide React
- **Styling**: CSS

## 📁 Project Structure

```
MERN Social App/
├── backend/
│   ├── config/              # Configuration files (Database)
│   ├── controller/          # Route controllers (User, Post)
│   ├── middleware/          # Auth and file upload middleware
│   ├── models/              # Mongoose schemas (User, Post)
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions (Cloudinary, JWT)
│   ├── public/              # Static files
│   ├── index.js             # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── app/             # Redux store setup
│   │   ├── components/      # Reusable React components
│   │   │   ├── Navbar
│   │   │   ├── PostCard
│   │   │   ├── CommentSection
│   │   │   └── CreatePostModal
│   │   ├── features/        # Redux slices (Auth, Post)
│   │   ├── pages/           # Page components
│   │   │   ├── Auth (Login/Signup)
│   │   │   └── FeedPage
│   │   ├── assets/          # Images and static files
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/              # Static assets
│   ├── vite.config.js       # Vite configuration
│   ├── eslint.config.js     # ESLint configuration
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd Social\ app
```

#### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-app
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

#### 3. Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the URL shown in your terminal).

## 📝 Available Scripts

### Backend

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm test` - Run tests (not configured yet)

### Frontend

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## 🔐 Key Endpoints

### Authentication

- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user

### Posts

- `GET /api/post/` - Get all posts
- `POST /api/post/create` - Create a new post
- `GET /api/post/:id` - Get a specific post
- `DELETE /api/post/:id` - Delete a post

## 🎨 Components

### Frontend Components

- **Navbar** - Navigation bar with user profile
- **PostCard** - Individual post display
- **CommentSection** - Comments on posts
- **CreatePostModal** - Modal for creating new posts
- **Auth Pages** - Login and signup pages
- **FeedPage** - Main feed displaying all posts

## 🔑 Key Features Implementation

### Authentication

- Password hashing with bcryptjs
- JWT token-based session management
- Secure cookie storage

### Image Upload

- Multer for file handling
- Cloudinary integration for image storage
- Automated image optimization

### State Management

- Redux Toolkit for centralized state
- Auth slice for user authentication state
- Post slice for posts management

## 🐛 Common Issues & Solutions

### Port Already in Use

```bash
# Change the PORT in your .env file or kill the process using the port
```

### MongoDB Connection Failed

- Ensure MongoDB is running locally, or update `MONGODB_URI` with your MongoDB Atlas connection string
- Check your `.env` file for correct credentials

### Image Upload Not Working

- Verify Cloudinary credentials in `.env`
- Check file upload middleware configuration in `backend/middleware/multer.js`

## 📦 Dependencies Info

See `backend/package.json` and `frontend/package.json` for complete dependency lists and versions.

## 📖 API Documentation

Detailed API documentation can be found in the backend routes:

- [User Routes](backend/routes/user.routes.js)
- [Post Routes](backend/routes/post.routes.js)

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

[Your Name]

## 🆘 Support

For issues, questions, or feedback, please open an issue in the repository or contact the project maintainer.

---

Made with ❤️ using MERN Stack
