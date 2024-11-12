const express = require('express');
const app = express();
const port = 3000;

// Import homepage routes
const homepageRoutes = require('./Homepage/routes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Homepage/public'));

// Use homepage routes
app.use('/', homepageRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});