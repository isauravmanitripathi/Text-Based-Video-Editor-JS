// Homepage/public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    
    document.getElementById('createProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const projectName = document.getElementById('projectName').value.trim();
        
        if (projectName) {
            try {
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ projectName }),
                });
                
                if (response.ok) {
                    document.getElementById('projectName').value = '';
                    loadProjects();
                }
            } catch (error) {
                console.error('Error creating project:', error);
            }
        }
    });
});

async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';
        
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            projectElement.innerHTML = `
                <div>
                    <h4>${project.name}</h4>
                    <small class="text-muted">Created: ${new Date(project.created_at).toLocaleDateString()}</small>
                </div>
                <button class="btn-delete" onclick="deleteProject(${project.id})">Delete</button>
            `;
            projectsList.appendChild(projectElement);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                loadProjects();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }
}