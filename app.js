const express = require('express');
const session = require('express-session');
const path = require('path');

// Initialize Express app
const app = express();

// Controllers
const UsersController = require('./controllers/usersController');

// Middleware to check if user is authenticated
const authMiddleware = require('./middlewares/authMiddleware');

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auths');

app.use(express.json());
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

app.get('/', authMiddleware, UsersController.showAdminPage);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
