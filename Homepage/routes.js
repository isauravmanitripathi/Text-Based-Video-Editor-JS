// Homepage/routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('./database');

// Initialize database
db.initialize();

// Serve homepage
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// API Routes
router.post('/api/projects', async (req, res) => {
    try {
        const { projectName } = req.body;
        const result = await db.createProject(projectName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/projects', async (req, res) => {
    try {
        const projects = await db.getAllProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/projects/:id', async (req, res) => {
    try {
        await db.deleteProject(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;