document.addEventListener('DOMContentLoaded', () => {
  loadActivities();
  setupSignupForm();
});

async function loadActivities() {
  try {
    const response = await fetch('/activities');
    const activities = await response.json();
    
    displayActivities(activities);
    populateActivitySelect(activities);
  } catch (error) {
    document.getElementById('activities-list').innerHTML = 
      '<p class="error">Failed to load activities</p>';
  }
}

function displayActivities(activities) {
  const activitiesList = document.getElementById('activities-list');
  activitiesList.innerHTML = '';
  
  for (const [name, details] of Object.entries(activities)) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    
    const participantsHtml = details.participants.length > 0
      ? `<ul>${details.participants.map(email => `<li>${email}</li>`).join('')}</ul>`
      : '<p class="no-participants">No participants yet</p>';
    
    card.innerHTML = `
      <h4>${name}</h4>
      <p><strong>Description:</strong> ${details.description}</p>
      <p><strong>Schedule:</strong> ${details.schedule}</p>
      <p><strong>Capacity:</strong> ${details.participants.length}/${details.max_participants}</p>
      <div class="participants">
        <h5>Participants:</h5>
        ${participantsHtml}
      </div>
    `;
    
    activitiesList.appendChild(card);
  }
}

function populateActivitySelect(activities) {
  const select = document.getElementById('activity');
  
  for (const name of Object.keys(activities)) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  }
}

function setupSignupForm() {
  const form = document.getElementById('signup-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const activity = document.getElementById('activity').value;
    
    try {
      const response = await fetch(`/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage(data.message, 'success');
        form.reset();
        loadActivities();
      } else {
        showMessage(data.detail || 'Signup failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    }
  });
}

function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove('hidden');
  
  setTimeout(() => {
    messageDiv.classList.add('hidden');
  }, 5000);
}
