# 📚 Personalized Micro-Learning Feed

A production-style MERN stack application that delivers personalized learning content in an Instagram-style feed. Content is automatically fetched from RSS feeds, tagged, and personalized based on user interests, with real-time updates via WebSockets.

## ✨ Features

- **JWT Authentication** - Secure user registration and login with password hashing
- **Personalized Feed** - Content filtered based on user interests
- **Real-Time Updates** - Socket.io pushes new content to users instantly
- **Automated Content Fetching** - Cron jobs fetch and process RSS feeds hourly
- **Interest Management** - Users can update their interests anytime
- **Mobile-First Design** - Clean, responsive UI that works on all devices
- **Smart Tagging** - Automatic keyword extraction and difficulty classification
- **Reading Time Estimation** - Calculates estimated reading time for each article

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time WebSocket communication
- **node-cron** - Scheduled tasks for RSS fetching
- **rss-parser** - RSS feed parsing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - WebSocket client
- **Context API** - State management

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Content.js         # Content schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes (register, login)
│   │   ├── user.js            # User routes (profile, interests)
│   │   └── content.js         # Content routes (feed)
│   ├── utils/
│   │   └── rssParser.js       # RSS feed fetcher & processor
│   ├── server.js              # Express server + Socket.io
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js       # Login screen
│   │   │   ├── Signup.js      # Signup screen
│   │   │   ├── Feed.js        # Main feed
│   │   │   ├── FeedItem.js    # Individual feed card
│   │   │   ├── Profile.js     # User profile
│   │   │   └── Navbar.js      # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.js # Auth state management
│   │   ├── services/
│   │   │   ├── api.js         # API service
│   │   │   └── socket.js      # Socket.io service
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd r
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/micro-learning
   JWT_SECRET=your_secret_key_change_this
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   App will open at http://localhost:3000

## 📖 How It Works

### Authentication Flow
1. User signs up with email, password, and optional interests
2. Password is hashed with bcrypt before storing
3. JWT token is generated and returned to client
4. Token is stored in localStorage and attached to all API requests
5. Protected routes verify token via middleware

### Content Fetching & Processing
1. **Cron Job** runs every hour to fetch RSS feeds
2. **RSS Parser** fetches articles from multiple sources
3. **Keyword Extraction** automatically tags content based on keywords
4. **Difficulty Detection** classifies content as beginner/intermediate/advanced
5. **Reading Time** estimated based on word count
6. **Summary Generation** creates short summaries from content
7. **Socket.io** broadcasts new content to all connected clients

### Personalization
- If user has interests selected: shows only content matching those tags
- If no interests: shows all content
- Users can update interests anytime from profile page
- Feed refreshes automatically when new content arrives

## 🎨 Features Walkthrough

### Signup & Login
- Simple, clean authentication forms
- Password validation
- Interest selection during signup
- Error handling and loading states

### Main Feed
- Instagram-style card layout
- Shows title, summary, tags, reading time, and difficulty
- Click any card to open the full article
- Real-time notification banner when new content arrives
- Infinite scroll with "Load More" pagination

### Profile Page
- View user email
- Update interests with tag selection
- Logout functionality
- Changes apply immediately to feed

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/interests` - Update interests (protected)

### Content
- `GET /api/content/feed` - Get personalized feed (protected)
- `GET /api/content/all` - Get all content (protected)

### WebSocket Events
- `newContent` - Emitted when new content is added

## 🎯 Key Learning Concepts Demonstrated

1. **JWT Authentication** - Complete auth flow with token management
2. **Password Security** - Bcrypt hashing before storage
3. **Protected Routes** - Middleware-based route protection
4. **Real-Time Communication** - Socket.io for live updates
5. **Background Jobs** - Cron jobs for scheduled tasks
6. **RESTful API Design** - Clean, organized endpoints
7. **State Management** - React Context API for global state
8. **Responsive Design** - Mobile-first CSS approach
9. **Error Handling** - Comprehensive error handling on both ends
10. **Clean Code** - Modular, well-organized code structure

## 🚢 Production Deployment

### Backend (e.g., Heroku, Railway, Render)
1. Set environment variables
2. Connect to MongoDB Atlas
3. Deploy backend

### Frontend (e.g., Vercel, Netlify)
1. Build the React app: `npm run build`
2. Set environment variables
3. Deploy the build folder

### MongoDB
- Use MongoDB Atlas for cloud hosting
- Update MONGODB_URI in backend .env

## 📝 Customization

### Add More RSS Feeds
Edit `backend/utils/rssParser.js`:
```javascript
const RSS_FEEDS = [
  { url: 'your-feed-url', source: 'Source Name', tags: ['tag1', 'tag2'] },
  // Add more feeds here
];
```

### Add More Interests
Edit the `AVAILABLE_INTERESTS` array in:
- `frontend/src/components/Signup.js`
- `frontend/src/components/Profile.js`

### Modify Tag Extraction
Customize keyword detection in `backend/utils/rssParser.js`:
```javascript
const keywords = {
  newtag: ['keyword1', 'keyword2'],
  // Add more tags and keywords
};
```

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new features
- Improve the UI
- Add more RSS sources
- Enhance the tagging algorithm
- Add bookmarking functionality
- Implement content search

## 📄 License

MIT

## 👨‍💻 Author

Created as a production-style beginner-friendly MERN stack learning project.

---

**Happy Learning! 📚✨**
