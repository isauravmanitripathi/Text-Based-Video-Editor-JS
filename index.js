const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Import routes
const homepageRoutes = require('./Homepage/routes');
const projectRoutes = require('./Projects/routes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'Homepage/public')));
app.use('/project', express.static(path.join(__dirname, 'Projects/public')));

// Use routes
app.use('/', homepageRoutes);
app.use('/project', projectRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});