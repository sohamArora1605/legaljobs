const DEFAULT_API_URL = 'http://localhost:5000';

let currentProfile = null;
let currentToken = null;

async function checkAuth(apiUrl) {
  chrome.storage.local.get(['authToken', 'cachedProfile', 'authUser'], async (res) => {
    if (res.authToken) {
      currentToken = res.authToken;
      if (res.cachedProfile) {
        currentProfile = res.cachedProfile;
        renderProfile(res.cachedProfile, res.authUser);
      }
      // Re-validate and sync latest profile from backend
      try {
        const fetchRes = await fetch(`${apiUrl}/api/extension/profile`, {
          headers: { Authorization: `Bearer ${res.authToken}` }
        });
        if (fetchRes.ok) {
          const profile = await fetchRes.json();
          currentProfile = profile;
          chrome.storage.local.set({ cachedProfile: profile });
          renderProfile(profile, res.authUser);
        } else if (fetchRes.status === 401) {
          showLoginBox();
        }
      } catch (err) {
        console.warn('Offline sync, using cached profile:', err);
      }
    } else {
      showLoginBox();
    }
  });
}

function showLoginBox() {
  document.getElementById('authBox').style.display = 'flex';
  document.getElementById('candidatePreview').style.display = 'none';
  document.getElementById('autofillBtn').disabled = true;
  document.getElementById('syncStatus').innerText = 'Sign In Required';
  document.getElementById('syncStatus').style.color = '#fbbf24';
}

function renderProfile(profile, user) {
  document.getElementById('authBox').style.display = 'none';
  document.getElementById('candidatePreview').style.display = 'block';
  document.getElementById('autofillBtn').disabled = false;

  document.getElementById('previewName').innerText = profile.fullName || user?.username || 'Candidate Profile';
  document.getElementById('previewCollege').innerText = `${profile.college || 'Law School'} • ${profile.yearOfStudy || 'Student'}`;
  document.getElementById('previewPractice').innerText = (profile.preferredPractice || 'Corporate').split(',')[0];
  document.getElementById('previewLocation').innerText = (profile.preferredLocation || 'Bengaluru').split(',')[0];
  document.getElementById('syncStatus').innerText = `Linked: ${user?.username || 'Active'}`;
  document.getElementById('syncStatus').style.color = '#34d399';
}

document.addEventListener('DOMContentLoaded', () => {
  let apiUrl = DEFAULT_API_URL;
  chrome.storage.local.get(['apiUrl'], (res) => {
    if (res.apiUrl) apiUrl = res.apiUrl;
    document.getElementById('apiUrlInput').value = apiUrl;
    checkAuth(apiUrl);
  });

  // Login Button in Extension
  document.getElementById('extLoginBtn').addEventListener('click', async () => {
    const username = document.getElementById('extUsername').value.trim();
    const password = document.getElementById('extPassword').value.trim();
    const authMsg = document.getElementById('authMsg');
    apiUrl = document.getElementById('apiUrlInput').value.trim() || DEFAULT_API_URL;

    if (!username || !password) {
      authMsg.className = 'status-msg error';
      authMsg.innerText = 'Please enter both username & password';
      return;
    }

    authMsg.className = 'status-msg';
    authMsg.innerText = 'Signing in to chambers...';

    try {
      const res = await fetch(`${apiUrl}/api/extension/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        currentToken = data.token;
        currentProfile = data.profile;
        chrome.storage.local.set({
          authToken: data.token,
          authUser: data.user,
          cachedProfile: data.profile,
          apiUrl
        });
        renderProfile(data.profile, data.user);
        authMsg.innerText = '';
      } else {
        authMsg.className = 'status-msg error';
        authMsg.innerText = data.error || 'Authentication failed';
      }
    } catch (e) {
      authMsg.className = 'status-msg error';
      authMsg.innerText = 'Unable to connect to LegalJobs server.';
    }
  });

  // Logout Button in Extension
  document.getElementById('extLogoutBtn').addEventListener('click', () => {
    chrome.storage.local.remove(['authToken', 'authUser', 'cachedProfile'], () => {
      currentProfile = null;
      currentToken = null;
      showLoginBox();
    });
  });

  document.getElementById('refreshProfileBtn').addEventListener('click', () => {
    apiUrl = document.getElementById('apiUrlInput').value.trim() || DEFAULT_API_URL;
    chrome.storage.local.set({ apiUrl });
    checkAuth(apiUrl);
  });

  // Autofill Button
  document.getElementById('autofillBtn').addEventListener('click', async () => {
    const statusMsg = document.getElementById('statusMsg');
    if (!currentProfile) {
      statusMsg.className = 'status-msg error';
      statusMsg.innerText = 'Please log in to load your profile.';
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      statusMsg.className = 'status-msg error';
      statusMsg.innerText = 'No active tab found.';
      return;
    }

    statusMsg.className = 'status-msg';
    statusMsg.innerText = 'Analyzing page fields...';

    chrome.tabs.sendMessage(tab.id, { action: 'AUTOFILL', profile: currentProfile }, (response) => {
      if (chrome.runtime.lastError) {
        statusMsg.className = 'status-msg error';
        statusMsg.innerText = 'Cannot access fields on this browser page.';
        return;
      }

      if (response && response.success) {
        statusMsg.className = 'status-msg success';
        statusMsg.innerText = `Populated ${response.count} field(s)! Please review before submitting.`;
      }
    });
  });
});
