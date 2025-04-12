const express = require('express');
const session = require('express-session');
const path = require('path');

// Initialize Express app
const app = express();

// Import routes
const usersRouter = require('./routes/users');

app.use(express.json());
app.use('/users', usersRouter);

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
