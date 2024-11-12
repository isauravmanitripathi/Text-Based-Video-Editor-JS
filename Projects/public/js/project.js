let currentProject = null;
let timeline = null;

document.addEventListener('DOMContentLoaded', () => {
    // Get project ID from URL
    const projectId = window.location.pathname.split('/').pop();
    loadProjectData(projectId);
    
    // Initialize event listeners
    initializeEventListeners();
});

function initializeEventListeners() {
    // Edit title button
    document.getElementById('editTitle').addEventListener('click', () => {
        const titleModal = new bootstrap.Modal(document.getElementById('editTitleModal'));
        document.getElementById('newTitleInput').value = document.getElementById('projectTitle').textContent;
        titleModal.show();
    });
    
    // Save title button
    document.getElementById('saveTitleBtn').addEventListener('click', async () => {
        const newTitle = document.getElementById('newTitleInput').value.trim();
        if (newTitle && currentProject) {
            await updateProjectTitle(currentProject.id, newTitle);
            bootstrap.Modal.getInstance(document.getElementById('editTitleModal')).hide();
        }
    });
    
    // Tool buttons
    document.getElementById('uploadVideo').addEventListener('click', handleVideoUpload);
    document.getElementById('uploadAudio').addEventListener('click', handleAudioUpload);
    document.getElementById('generateTranscript').addEventListener('click', handleTranscriptGeneration);
    document.getElementById('saveProject').addEventListener('click', handleProjectSave);
    
    // Timeline zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => handleTimelineZoom('in'));
    document.getElementById('zoomOut').addEventListener('click', () => handleTimelineZoom('out'));
}

async function loadProjectData(projectId) {
    try {
        const response = await fetch(`/project/api/${projectId}/data`);
        const project = await response.json();
        
        if (project) {
            currentProject = project;
            updateProjectUI(project);
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showNotification('Error loading project', 'error');
    }
}

function updateProjectUI(project) {
    document.title = `${project.name} - Video Editor`;
    document.getElementById('projectTitle').textContent = project.name;
    document.getElementById('projectName').textContent = project.name;
}

async function updateProjectTitle(projectId, newTitle) {
    try {
        const response = await fetch(`/project/api/${projectId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newTitle }),
        });
        
        if (response.ok) {
            const result = await response.json();
            updateProjectUI(result);
            showNotification('Project title updated successfully');
        }
    } catch (error) {
        console.error('Error updating project title:', error);
        showNotification('Error updating project title', 'error');
    }
}

function handleVideoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // TODO: Implement video upload logic
            console.log('Video selected:', file.name);
            showNotification('Video upload feature coming soon');
        }
    };
    input.click();
}

function handleAudioUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // TODO: Implement audio upload logic
            console.log('Audio selected:', file.name);
            showNotification('Audio upload feature coming soon');
        }
    };
    input.click();
}

function handleTranscriptGeneration() {
    // TODO: Implement transcript generation logic
    showNotification('Transcript generation feature coming soon');
}

function handleProjectSave() {
    // TODO: Implement project save logic
    showNotification('Project saved successfully');
}

function handleTimelineZoom(direction) {
    // TODO: Implement timeline zoom logic
    console.log('Timeline zoom:', direction);
}

function showNotification(message, type = 'success') {
    // You can implement a proper notification system here
    alert(message);
}