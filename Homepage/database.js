// Homepage/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'projects.db'));

function initialize() {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function createProject(name) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO projects (name) VALUES (?)', [name], function(err) {
            if (err) reject(err);
            else {
                resolve({
                    id: this.lastID,
                    name,
                    created_at: new Date().toISOString()
                });
            }
        });
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM projects ORDER BY created_at DESC', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function deleteProject(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM projects WHERE id = ?', [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = { initialize, createProject, getAllProjects, deleteProject };