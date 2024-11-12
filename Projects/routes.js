const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../Homepage/database');

// Serve project page
router.get('/:id', async (req, res) => {
    try {
        const project = await db.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).redirect('/');
        }
        return res.sendFile(path.join(__dirname, 'views/project.html'));
    } catch (error) {
        console.error('Error serving project page:', error);
        return res.status(500).redirect('/');
    }
});

// Get project data
router.get('/api/:id/data', async (req, res) => {
    try {
        const project = await db.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.json(project);
    } catch (error) {
        console.error('Error getting project data:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Update project
router.put('/api/:id/update', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await db.updateProject(req.params.id, name);
        return res.json(result);
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;