const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'projects.db'));

function initialize() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create projects table
            db.run(`
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating projects table:', err);
                    reject(err);
                }
            });

            // Create videos table
            db.run(`
                CREATE TABLE IF NOT EXISTS videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER,
                    filename TEXT NOT NULL,
                    filepath TEXT NOT NULL,
                    duration INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES projects (id)
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating videos table:', err);
                    reject(err);
                }
            });

            // Create audio table
            db.run(`
                CREATE TABLE IF NOT EXISTS audio (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER,
                    filename TEXT NOT NULL,
                    filepath TEXT NOT NULL,
                    duration INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES projects (id)
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating audio table:', err);
                    reject(err);
                }
            });

            // Create transcripts table
            db.run(`
                CREATE TABLE IF NOT EXISTS transcripts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER,
                    video_id INTEGER,
                    content TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES projects (id),
                    FOREIGN KEY (video_id) REFERENCES videos (id)
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating transcripts table:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

// Project-related functions
function createProject(name) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO projects (name) VALUES (?)',
            [name],
            function(err) {
                if (err) {
                    console.error('Error creating project:', err);
                    reject(err);
                } else {
                    getProjectById(this.lastID)
                        .then(project => resolve(project))
                        .catch(err => reject(err));
                }
            }
        );
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM projects ORDER BY created_at DESC',
            [],
            (err, rows) => {
                if (err) {
                    console.error('Error getting all projects:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

function getProjectById(id) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM projects WHERE id = ?',
            [id],
            (err, row) => {
                if (err) {
                    console.error('Error getting project by ID:', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

function updateProject(id, name) {
    return new Promise((resolve, reject) => {
        const now = new Date().toISOString();
        db.run(
            'UPDATE projects SET name = ?, updated_at = ? WHERE id = ?',
            [name, now, id],
            (err) => {
                if (err) {
                    console.error('Error updating project:', err);
                    reject(err);
                } else {
                    getProjectById(id)
                        .then(project => resolve(project))
                        .catch(err => reject(err));
                }
            }
        );
    });
}

function deleteProject(id) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Begin transaction
            db.run('BEGIN TRANSACTION');

            // Delete associated transcripts
            db.run('DELETE FROM transcripts WHERE project_id = ?', [id], (err) => {
                if (err) {
                    console.error('Error deleting transcripts:', err);
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                }
            });

            // Delete associated videos
            db.run('DELETE FROM videos WHERE project_id = ?', [id], (err) => {
                if (err) {
                    console.error('Error deleting videos:', err);
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                }
            });

            // Delete associated audio
            db.run('DELETE FROM audio WHERE project_id = ?', [id], (err) => {
                if (err) {
                    console.error('Error deleting audio:', err);
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                }
            });

            // Delete the project
            db.run('DELETE FROM projects WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Error deleting project:', err);
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                }

                // Commit transaction
                db.run('COMMIT', (err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        db.run('ROLLBACK');
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
    });
}

// Video-related functions
function addVideo(projectId, filename, filepath, duration) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO videos (project_id, filename, filepath, duration) VALUES (?, ?, ?, ?)',
            [projectId, filename, filepath, duration],
            function(err) {
                if (err) {
                    console.error('Error adding video:', err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}

function getProjectVideos(projectId) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM videos WHERE project_id = ? ORDER BY created_at DESC',
            [projectId],
            (err, rows) => {
                if (err) {
                    console.error('Error getting project videos:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Audio-related functions
function addAudio(projectId, filename, filepath, duration) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO audio (project_id, filename, filepath, duration) VALUES (?, ?, ?, ?)',
            [projectId, filename, filepath, duration],
            function(err) {
                if (err) {
                    console.error('Error adding audio:', err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}

function getProjectAudio(projectId) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM audio WHERE project_id = ? ORDER BY created_at DESC',
            [projectId],
            (err, rows) => {
                if (err) {
                    console.error('Error getting project audio:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Transcript-related functions
function addTranscript(projectId, videoId, content) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO transcripts (project_id, video_id, content) VALUES (?, ?, ?)',
            [projectId, videoId, content],
            function(err) {
                if (err) {
                    console.error('Error adding transcript:', err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}

function getProjectTranscripts(projectId) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM transcripts WHERE project_id = ? ORDER BY created_at DESC',
            [projectId],
            (err, rows) => {
                if (err) {
                    console.error('Error getting project transcripts:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Error handling
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

module.exports = {
    initialize,
    // Project functions
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    // Video functions
    addVideo,
    getProjectVideos,
    // Audio functions
    addAudio,
    getProjectAudio,
    // Transcript functions
    addTranscript,
    getProjectTranscripts
};