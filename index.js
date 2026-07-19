// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

const fetchWeatherAlerts = async (state) => {
  const stateAbbr = state.toUpperCase().trim();
  const url = `https://api.weather.gov/alerts/active?area=${stateAbbr}`;
  
  const errorContainer = document.getElementById('error-message');
  const container = document.getElementById('alerts-display');

  if (errorContainer) {
    errorContainer.textContent = '';
    errorContainer.classList.add('hidden');
  }
  if (container) {
    container.innerHTML = '';
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'NationalSafetyAwarenessApp/1.0' }
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    displayAlerts(data); 
    return data;

  } catch (errorObject) {
    console.log(errorObject.message);
    displayError(errorObject.message);
  }
};

function displayAlerts(data) {
  const container = document.getElementById('alerts-display');
  if (!container) return;
  container.innerHTML = ''; 

  if (!data || !data.features || data.features.length === 0) {
    container.innerHTML = '<p class="no-alerts">No active weather alerts for this state.</p>';
    return;
  }

  const summaryElement = document.createElement('h3');
  summaryElement.textContent = `Weather Alerts: ${data.features.length}`;
  container.appendChild(summaryElement);

  const listElement = document.createElement('ul');
  data.features.forEach(alert => {
    const listItem = document.createElement('li');
    listItem.textContent = alert.properties.headline;
    listElement.appendChild(listItem);
  });

  container.appendChild(listElement);
}

function displayError(message) {
  const errorContainer = document.getElementById('error-message');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden'); 
  }
}

function init() {
  const searchButton = document.getElementById('fetch-alerts');
  const stateInput = document.getElementById('state-input');

  if (searchButton && stateInput) {
    searchButton.addEventListener('click', () => {
      const stateValue = stateInput.value;
      if (stateValue) {
        fetchWeatherAlerts(stateValue);
        stateInput.value = ''; 
      }
    });

    stateInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && stateInput.value) {
        fetchWeatherAlerts(stateInput.value);
        stateInput.value = ''; 
      }
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchWeatherAlerts, displayAlerts, displayError };
}
