// GOD LEVEL Healthcare AI Platform JavaScript

// Application data
const AppData = {
  diseases: [
    {"name": "Diabetes Type 2", "symptoms": ["High glucose", "Frequent urination", "Fatigue"], "risk_factors": ["Age > 45", "BMI > 25", "Family history"], "prevalence": 0.11},
    {"name": "Hypertension", "symptoms": ["High blood pressure", "Headache", "Dizziness"], "risk_factors": ["Age", "Obesity", "Stress"], "prevalence": 0.34},
    {"name": "Cardiovascular Disease", "symptoms": ["Chest pain", "Shortness of breath", "Fatigue"], "risk_factors": ["High cholesterol", "Smoking", "Diabetes"], "prevalence": 0.06},
    {"name": "Hyperlipidemia", "symptoms": ["No symptoms", "Fatty deposits"], "risk_factors": ["Diet", "Genetics", "Lack of exercise"], "prevalence": 0.25},
    {"name": "Obesity", "symptoms": ["Excessive weight", "Breathing problems"], "risk_factors": ["Diet", "Lifestyle", "Genetics"], "prevalence": 0.42}
  ],
  medications: [
    {"name": "Metformin", "indication": "Diabetes Type 2", "dosage": "500-1000mg twice daily", "side_effects": ["Nausea", "Diarrhea"], "interactions": ["Alcohol", "Contrast dyes"]},
    {"name": "Lisinopril", "indication": "Hypertension", "dosage": "10-20mg once daily", "side_effects": ["Dry cough", "Dizziness"], "interactions": ["NSAIDs", "Potassium supplements"]},
    {"name": "Atorvastatin", "indication": "Hyperlipidemia", "dosage": "20-40mg once daily", "side_effects": ["Muscle pain", "Liver enzymes"], "interactions": ["Grapefruit", "Cyclosporine"]},
    {"name": "Aspirin", "indication": "Cardiovascular Disease", "dosage": "81mg once daily", "side_effects": ["GI bleeding", "Tinnitus"], "interactions": ["Warfarin", "NSAIDs"]}
  ],
  patient_examples: [
    {"name": "John Smith", "age": 45, "gender": "Male", "bp_systolic": 140, "bp_diastolic": 90, "heart_rate": 78, "glucose": 126, "bmi": 28.5},
    {"name": "Maria Garcia", "age": 62, "gender": "Female", "bp_systolic": 160, "bp_diastolic": 95, "heart_rate": 82, "glucose": 180, "bmi": 32.1},
    {"name": "David Chen", "age": 38, "gender": "Male", "bp_systolic": 120, "bp_diastolic": 80, "heart_rate": 72, "glucose": 95, "bmi": 24.8}
  ],
  vital_ranges: {
    "bp_systolic": {"normal": [90, 120], "elevated": [120, 129], "high": [130, 180]},
    "bp_diastolic": {"normal": [60, 80], "elevated": [80, 89], "high": [90, 120]},
    "heart_rate": {"normal": [60, 100], "low": [40, 60], "high": [100, 200]},
    "glucose": {"normal": [70, 100], "prediabetes": [100, 125], "diabetes": [126, 400]},
    "bmi": {"underweight": [0, 18.5], "normal": [18.5, 25], "overweight": [25, 30], "obese": [30, 50]}
  },
  system_stats: {
    "total_patients": 1247893,
    "predictions_made": 5639421,
    "accuracy_rate": 0.955,
    "active_integrations": 1247
  }
};

// Current patient data
let currentPatient = null;
let currentPredictions = null;

// Application state
const AppState = {
  currentSection: 'dashboard',
  charts: {},
  settings: {
    confidenceThreshold: 0.85,
    multiModalEnabled: true,
    federatedMode: 'active'
  }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Healthcare AI Platform...');
  
  // Initialize in correct order
  setupInitialState();
  initializeNavigation();
  initializePatientForm();
  initializeModals();
  initializeSettings();
  initializeRealTimeUpdates();
  loadDashboardStats();
  
  // Initialize charts after a delay to ensure Chart.js is loaded
  setTimeout(initializeCharts, 1000);
});

// Setup initial state
function setupInitialState() {
  // Ensure dashboard is visible initially
  showSection('dashboard');
}

// Navigation System - Completely rewritten
function initializeNavigation() {
  console.log('Setting up navigation system...');
  
  // Clear any existing event listeners and setup new ones
  const navItems = document.querySelectorAll('.nav-item');
  
  // Remove any existing listeners by cloning nodes
  navItems.forEach(item => {
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
  });
  
  // Get fresh references after cloning
  const freshNavItems = document.querySelectorAll('.nav-item');
  
  freshNavItems.forEach((item, index) => {
    const targetSection = item.getAttribute('data-section');
    console.log(`Setting up nav item ${index}: ${targetSection}`);
    
    item.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      
      console.log('Navigation clicked:', targetSection);
      
      if (targetSection) {
        // Update navigation state
        freshNavItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // Show the section
        showSection(targetSection);
        AppState.currentSection = targetSection;
        
        console.log('Successfully navigated to:', targetSection);
      }
    });
    
    // Prevent any other events from interfering
    item.addEventListener('mousedown', function(e) {
      e.stopPropagation();
    });
  });
  
  // Setup quick action buttons
  setupQuickActions();
}

function setupQuickActions() {
  const actionButtons = document.querySelectorAll('[data-action]');
  
  actionButtons.forEach(button => {
    // Clone to remove existing listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });
  
  // Get fresh references and add listeners
  const freshActionButtons = document.querySelectorAll('[data-action]');
  
  freshActionButtons.forEach(button => {
    const action = button.getAttribute('data-action');
    
    button.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      
      console.log('Quick action clicked:', action);
      handleQuickAction(action);
    });
  });
}

function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  
  // Hide all sections first
  const allSections = document.querySelectorAll('.section');
  allSections.forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
    
    console.log('Section displayed:', sectionId);
    
    // Handle section-specific initialization
    if (sectionId === 'analytics') {
      setTimeout(() => {
        updateAnalyticsCharts();
      }, 200);
    }
  } else {
    console.error('Section not found:', sectionId);
  }
}

function handleQuickAction(action) {
  console.log('Handling quick action:', action);
  
  const navigationMap = {
    'new-patient': 'patient-analysis',
    'disease-predict': 'disease-prediction', 
    'drug-interaction': 'medicine-recommendation',
    'generate-report': null // Special case
  };
  
  if (action === 'generate-report') {
    generateReport();
    return;
  }
  
  const targetSection = navigationMap[action];
  if (targetSection) {
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(nav => nav.classList.remove('active'));
    
    const targetNav = document.querySelector(`[data-section="${targetSection}"]`);
    if (targetNav) {
      targetNav.classList.add('active');
    }
    
    // Show section
    showSection(targetSection);
    AppState.currentSection = targetSection;
  }
}

// Patient Form Management
function initializePatientForm() {
  console.log('Setting up patient form...');
  
  const form = document.getElementById('patient-form');
  const loadSampleBtn = document.getElementById('load-sample');
  
  if (form) {
    // Remove existing listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add fresh listener
    document.getElementById('patient-form').addEventListener('submit', handlePatientSubmission);
  }
  
  if (loadSampleBtn) {
    // Remove existing listeners  
    const newBtn = loadSampleBtn.cloneNode(true);
    loadSampleBtn.parentNode.replaceChild(newBtn, loadSampleBtn);
    
    // Add fresh listener
    document.getElementById('load-sample').addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      loadSamplePatient();
    });
  }
  
  // Setup form input listeners for real-time updates
  setupFormInputListeners();
  
  // File upload handler
  const fileInput = document.getElementById('medical-images');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
}

function setupFormInputListeners() {
  const formInputs = document.querySelectorAll('#patient-form input, #patient-form select');
  formInputs.forEach(input => {
    input.addEventListener('input', updateVitalSigns);
    input.addEventListener('change', updateVitalSigns);
  });
}

function handlePatientSubmission(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Patient form submitted');
  
  if (!validatePatientForm()) {
    return;
  }
  
  const formData = collectPatientData();
  currentPatient = formData;
  console.log('Patient data collected:', formData);
  
  // Start AI analysis simulation
  startAIAnalysis(formData);
}

function validatePatientForm() {
  const requiredFields = ['patient-name', 'patient-age', 'patient-gender'];
  
  for (let fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      if (field) field.focus();
      showNotification('Please fill in all required fields', 'error');
      return false;
    }
  }
  
  // Validate age range
  const ageField = document.getElementById('patient-age');
  const age = parseInt(ageField.value);
  if (age < 1 || age > 120) {
    showNotification('Please enter a valid age between 1 and 120', 'error');
    return false;
  }
  
  return true;
}

function collectPatientData() {
  return {
    name: document.getElementById('patient-name').value.trim(),
    age: parseInt(document.getElementById('patient-age').value),
    gender: document.getElementById('patient-gender').value,
    bp_systolic: parseInt(document.getElementById('bp-systolic').value) || null,
    bp_diastolic: parseInt(document.getElementById('bp-diastolic').value) || null,
    heart_rate: parseInt(document.getElementById('heart-rate').value) || null,
    glucose: parseInt(document.getElementById('glucose-level').value) || null,
    bmi: parseFloat(document.getElementById('patient-bmi').value) || null,
    medical_history: Array.from(document.getElementById('medical-history').selectedOptions).map(option => option.value),
    timestamp: new Date().toISOString()
  };
}

function loadSamplePatient() {
  console.log('Loading sample patient...');
  const sample = AppData.patient_examples[Math.floor(Math.random() * AppData.patient_examples.length)];
  
  document.getElementById('patient-name').value = sample.name;
  document.getElementById('patient-age').value = sample.age;
  document.getElementById('patient-gender').value = sample.gender.toLowerCase();
  document.getElementById('bp-systolic').value = sample.bp_systolic;
  document.getElementById('bp-diastolic').value = sample.bp_diastolic;
  document.getElementById('heart-rate').value = sample.heart_rate;
  document.getElementById('glucose-level').value = sample.glucose;
  document.getElementById('patient-bmi').value = sample.bmi;
  
  updateVitalSigns();
  showNotification('Sample patient data loaded successfully', 'success');
}

function updateVitalSigns() {
  const bp_sys = document.getElementById('bp-systolic').value;
  const bp_dia = document.getElementById('bp-diastolic').value;
  const hr = document.getElementById('heart-rate').value;
  const glucose = document.getElementById('glucose-level').value;
  const bmi = document.getElementById('patient-bmi').value;
  
  const displayBp = document.getElementById('display-bp');
  const displayHr = document.getElementById('display-hr');
  const displayGlucose = document.getElementById('display-glucose');
  const displayBmi = document.getElementById('display-bmi');
  
  if (displayBp) displayBp.textContent = (bp_sys && bp_dia) ? `${bp_sys}/${bp_dia}` : '--/--';
  if (displayHr) displayHr.textContent = hr || '--';
  if (displayGlucose) displayGlucose.textContent = glucose || '--';
  if (displayBmi) displayBmi.textContent = bmi || '--';
}

function handleFileUpload(e) {
  const files = e.target.files;
  if (files.length > 0) {
    showNotification(`${files.length} file(s) uploaded successfully`, 'success');
  }
}

// AI Analysis Simulation
function startAIAnalysis(patientData) {
  console.log('Starting AI analysis...');
  showLoadingModal();
  
  const stages = [
    { text: 'Initializing AI models...', detail: 'Loading multi-modal transformer networks', duration: 1000 },
    { text: 'Processing clinical data...', detail: 'Analyzing patient vitals and history', duration: 1500 },
    { text: 'Running disease prediction...', detail: 'Federated learning inference in progress', duration: 2000 },
    { text: 'Generating recommendations...', detail: 'Personalizing treatment suggestions', duration: 1200 },
    { text: 'Finalizing analysis...', detail: 'Quality assurance and validation', duration: 800 }
  ];
  
  let currentStage = 0;
  
  function processStage() {
    if (currentStage >= stages.length) {
      completeAnalysis(patientData);
      return;
    }
    
    const stage = stages[currentStage];
    updateLoadingModal(stage.text, stage.detail, (currentStage + 1) / stages.length * 100);
    
    setTimeout(() => {
      currentStage++;
      processStage();
    }, stage.duration);
  }
  
  processStage();
}

function completeAnalysis(patientData) {
  console.log('Completing analysis...');
  hideLoadingModal();
  
  // Generate AI predictions
  const predictions = generateAIPredictions(patientData);
  currentPredictions = predictions;
  
  // Update disease prediction section
  updateDiseasePredictions(predictions);
  
  // Generate medicine recommendations
  const medicines = generateMedicineRecommendations(predictions);
  updateMedicineRecommendations(medicines);
  
  // Show results modal
  showResultsModal(predictions, medicines);
  
  showNotification('AI analysis completed successfully', 'success');
}

function generateAIPredictions(patientData) {
  const predictions = [];
  
  // Risk calculation based on patient data
  AppData.diseases.forEach(disease => {
    let riskScore = Math.random() * 0.3 + 0.1; // Base risk 10-40%
    
    // Adjust risk based on patient factors
    if (disease.name === 'Diabetes Type 2' && patientData.glucose > 125) {
      riskScore += 0.4;
    }
    if (disease.name === 'Hypertension' && patientData.bp_systolic > 140) {
      riskScore += 0.35;
    }
    if (disease.name === 'Cardiovascular Disease' && patientData.age > 60) {
      riskScore += 0.25;
    }
    if (disease.name === 'Obesity' && patientData.bmi > 30) {
      riskScore += 0.5;
    }
    
    // Age factor
    if (patientData.age > 50) {
      riskScore += 0.1;
    }
    
    riskScore = Math.min(riskScore, 0.95); // Cap at 95%
    
    if (riskScore > 0.2) { // Only include significant risks
      predictions.push({
        disease: disease.name,
        confidence: riskScore,
        risk_factors: disease.risk_factors,
        symptoms: disease.symptoms,
        prevalence: disease.prevalence
      });
    }
  });
  
  return predictions.sort((a, b) => b.confidence - a.confidence);
}

function generateMedicineRecommendations(predictions) {
  const recommendations = [];
  
  predictions.forEach(prediction => {
    const relevantMeds = AppData.medications.filter(med => 
      med.indication.toLowerCase().includes(prediction.disease.toLowerCase()) ||
      prediction.disease.toLowerCase().includes(med.indication.toLowerCase())
    );
    
    relevantMeds.forEach(med => {
      recommendations.push({
        ...med,
        confidence: prediction.confidence * (0.8 + Math.random() * 0.2),
        for_condition: prediction.disease
      });
    });
  });
  
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

// UI Update Functions
function updateDiseasePredictions(predictions) {
  const container = document.getElementById('prediction-results');
  if (!container) return;
  
  if (predictions.length === 0) {
    container.innerHTML = `
      <div class="prediction-placeholder">
        <i class="fas fa-heartbeat"></i>
        <h3>No Significant Risk Factors Detected</h3>
        <p>Patient appears to have low risk for major conditions</p>
      </div>
    `;
    return;
  }
  
  const resultsHTML = `
    <div class="prediction-results">
      <h3>Disease Risk Assessment for ${currentPatient.name}</h3>
      ${predictions.map(pred => `
        <div class="prediction-card">
          <div class="prediction-header">
            <span class="disease-name">${pred.disease}</span>
            <span class="confidence-score">${(pred.confidence * 100).toFixed(1)}%</span>
          </div>
          <p><strong>Risk Factors:</strong></p>
          <div class="risk-factors">
            ${pred.risk_factors.map(factor => 
              `<span class="risk-factor-tag">${factor}</span>`
            ).join('')}
          </div>
          <p><strong>Common Symptoms:</strong> ${pred.symptoms.join(', ')}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  container.innerHTML = resultsHTML;
}

function updateMedicineRecommendations(medicines) {
  const container = document.getElementById('medicine-results');
  if (!container) return;
  
  if (medicines.length === 0) {
    container.innerHTML = `
      <div class="medicine-placeholder">
        <i class="fas fa-pills"></i>
        <h3>No Medications Recommended</h3>
        <p>No specific medication recommendations at this time</p>
      </div>
    `;
    return;
  }
  
  const medicinesHTML = `
    <div class="medicine-grid">
      <h3>Recommended Medications for ${currentPatient.name}</h3>
      ${medicines.map(med => `
        <div class="medicine-card">
          <div class="medicine-header">
            <span class="medicine-name">${med.name}</span>
            <span class="dosage">${med.dosage}</span>
          </div>
          <p><strong>For:</strong> ${med.for_condition}</p>
          <p><strong>Indication:</strong> ${med.indication}</p>
          <div class="side-effects">
            <strong>Side Effects:</strong> ${med.side_effects.join(', ')}
          </div>
          <div class="interactions">
            <strong>Interactions:</strong> ${med.interactions.map(interaction => 
              `<span class="warning-tag">${interaction}</span>`
            ).join(' ')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  container.innerHTML = medicinesHTML;
}

// Modal Management
function initializeModals() {
  console.log('Setting up modals...');
  
  // Close modal handlers
  const closeModal = document.getElementById('close-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const exportBtn = document.getElementById('export-report');
  
  if (closeModal) {
    closeModal.addEventListener('click', hideResultsModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideResultsModal);
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', exportReport);
  }
  
  // Click outside to close
  const resultsModal = document.getElementById('results-modal');
  if (resultsModal) {
    resultsModal.addEventListener('click', (e) => {
      if (e.target.id === 'results-modal') {
        hideResultsModal();
      }
    });
  }
}

function showLoadingModal() {
  const modal = document.getElementById('loading-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function updateLoadingModal(text, detail, progress) {
  const textEl = document.getElementById('loading-text');
  const detailEl = document.getElementById('loading-detail');
  const progressEl = document.getElementById('loading-progress');
  
  if (textEl) textEl.textContent = text;
  if (detailEl) detailEl.textContent = detail;
  if (progressEl) progressEl.style.width = `${progress}%`;
}

function hideLoadingModal() {
  const modal = document.getElementById('loading-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showResultsModal(predictions, medicines) {
  const modal = document.getElementById('results-modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  const content = `
    <div class="results-summary">
      <h3>Analysis Summary for ${currentPatient.name}</h3>
      <div class="summary-stats">
        <div class="summary-item">
          <span>Risk Conditions Identified:</span>
          <strong>${predictions.length}</strong>
        </div>
        <div class="summary-item">
          <span>Medications Recommended:</span>
          <strong>${medicines.length}</strong>
        </div>
        <div class="summary-item">
          <span>Analysis Confidence:</span>
          <strong>95.5%</strong>
        </div>
      </div>
      
      ${predictions.length > 0 ? `
        <h4>Top Risk Predictions:</h4>
        ${predictions.slice(0, 3).map(pred => `
          <div class="summary-prediction">
            <span>${pred.disease}</span>
            <span class="confidence">${(pred.confidence * 100).toFixed(1)}%</span>
          </div>
        `).join('')}
      ` : ''}
      
      <p class="disclaimer">
        <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical consultation.
      </p>
    </div>
  `;
  
  modalBody.innerHTML = content;
  modal.classList.remove('hidden');
}

function hideResultsModal() {
  const modal = document.getElementById('results-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Charts and Analytics
function initializeCharts() {
  console.log('Initializing charts...');
  
  // Wait for Chart.js to load
  if (typeof Chart === 'undefined') {
    console.log('Chart.js not loaded yet, retrying...');
    setTimeout(initializeCharts, 500);
    return;
  }
  
  const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
  
  // Disease Prevalence Chart
  const diseaseCtx = document.getElementById('disease-chart');
  if (diseaseCtx) {
    AppState.charts.diseaseChart = new Chart(diseaseCtx, {
      type: 'doughnut',
      data: {
        labels: AppData.diseases.map(d => d.name),
        datasets: [{
          data: AppData.diseases.map(d => d.prevalence * 100),
          backgroundColor: chartColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Performance Chart
  const perfCtx = document.getElementById('performance-chart');
  if (perfCtx) {
    AppState.charts.performanceChart = new Chart(perfCtx, {
      type: 'bar',
      data: {
        labels: ['Disease Predictor', 'Drug Analyzer', 'Medicine Engine'],
        datasets: [{
          label: 'Accuracy %',
          data: [95.5, 98.7, 92.3],
          backgroundColor: [chartColors[0], chartColors[1], chartColors[2]]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  // Usage Trends Chart
  const usageCtx = document.getElementById('usage-chart');
  if (usageCtx) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map(() => Math.floor(Math.random() * 1000000) + 500000);
    
    AppState.charts.usageChart = new Chart(usageCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Predictions Made',
          data: data,
          borderColor: chartColors[0],
          backgroundColor: chartColors[0] + '20',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Network Status Chart
  const networkCtx = document.getElementById('network-chart');
  if (networkCtx) {
    AppState.charts.networkChart = new Chart(networkCtx, {
      type: 'pie',
      data: {
        labels: ['Active Hospitals', 'Edge Devices', 'Cloud Nodes'],
        datasets: [{
          data: [1056, 9876, 247],
          backgroundColor: [chartColors[3], chartColors[4], chartColors[5]]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  console.log('Charts initialized successfully');
}

function updateAnalyticsCharts() {
  console.log('Updating analytics charts...');
  // Simulate real-time updates
  Object.values(AppState.charts).forEach(chart => {
    if (chart && chart.update) {
      chart.update();
    }
  });
}

// Settings Management
function initializeSettings() {
  console.log('Setting up settings...');
  
  const confidenceSlider = document.getElementById('confidence-threshold');
  const multiModalToggle = document.getElementById('multimodal-toggle');
  const federatedSelect = document.getElementById('federated-mode');
  
  // Update confidence threshold display
  if (confidenceSlider) {
    confidenceSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      const valueDisplay = e.target.nextElementSibling;
      if (valueDisplay) {
        valueDisplay.textContent = `${value}%`;
      }
      AppState.settings.confidenceThreshold = e.target.value;
    });
  }
  
  // Multi-modal toggle
  if (multiModalToggle) {
    multiModalToggle.addEventListener('change', (e) => {
      AppState.settings.multiModalEnabled = e.target.checked;
      showNotification(
        `Multi-modal analysis ${e.target.checked ? 'enabled' : 'disabled'}`, 
        'info'
      );
    });
  }
  
  // Federated learning mode
  if (federatedSelect) {
    federatedSelect.addEventListener('change', (e) => {
      AppState.settings.federatedMode = e.target.value;
      showNotification(`Federated learning set to ${e.target.value} mode`, 'info');
    });
  }
}

// Real-time Updates
function initializeRealTimeUpdates() {
  // Simulate real-time data updates every 30 seconds
  setInterval(updateSystemStats, 30000);
  
  // Animate numbers on page load
  setTimeout(animateStatNumbers, 1000);
}

function updateSystemStats() {
  const stats = AppData.system_stats;
  
  // Increment stats slightly
  stats.total_patients += Math.floor(Math.random() * 50) + 10;
  stats.predictions_made += Math.floor(Math.random() * 1000) + 100;
  stats.active_integrations += Math.floor(Math.random() * 5);
  
  // Update display
  const totalPatientsEl = document.getElementById('total-patients');
  const predictionsMadeEl = document.getElementById('predictions-made');
  const activeIntegrationsEl = document.getElementById('active-integrations');
  
  if (totalPatientsEl) totalPatientsEl.textContent = stats.total_patients.toLocaleString();
  if (predictionsMadeEl) predictionsMadeEl.textContent = stats.predictions_made.toLocaleString();
  if (activeIntegrationsEl) activeIntegrationsEl.textContent = stats.active_integrations.toLocaleString();
}

function animateStatNumbers() {
  const stats = document.querySelectorAll('.stat-content h3');
  
  stats.forEach(stat => {
    const finalValue = stat.textContent;
    const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
    
    if (!isNaN(numericValue)) {
      let currentValue = 0;
      const increment = numericValue / 50;
      
      const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= numericValue) {
          stat.textContent = finalValue;
          clearInterval(timer);
        } else {
          if (finalValue.includes('%')) {
            stat.textContent = `${currentValue.toFixed(1)}%`;
          } else if (finalValue.includes(',')) {
            stat.textContent = Math.floor(currentValue).toLocaleString();
          } else {
            stat.textContent = Math.floor(currentValue).toString();
          }
        }
      }, 50);
    }
  });
}

function loadDashboardStats() {
  const stats = AppData.system_stats;
  
  const totalPatientsEl = document.getElementById('total-patients');
  const predictionsMadeEl = document.getElementById('predictions-made');
  const accuracyRateEl = document.getElementById('accuracy-rate');
  const activeIntegrationsEl = document.getElementById('active-integrations');
  
  if (totalPatientsEl) totalPatientsEl.textContent = stats.total_patients.toLocaleString();
  if (predictionsMadeEl) predictionsMadeEl.textContent = stats.predictions_made.toLocaleString();
  if (accuracyRateEl) accuracyRateEl.textContent = `${(stats.accuracy_rate * 100).toFixed(1)}%`;
  if (activeIntegrationsEl) activeIntegrationsEl.textContent = stats.active_integrations.toLocaleString();
}

// Report Generation
function exportReport() {
  if (!currentPatient || !currentPredictions) {
    showNotification('No patient data to export', 'error');
    return;
  }
  
  const report = generateReportContent(currentPatient, currentPredictions);
  downloadReport(report, `${currentPatient.name}_Analysis_Report.html`);
  
  showNotification('Report exported successfully', 'success');
}

function generateReport() {
  if (!currentPatient || !currentPredictions) {
    showNotification('Please complete patient analysis first', 'error');
    return;
  }
  
  exportReport();
}

function generateReportContent(patient, predictions) {
  const timestamp = new Date().toLocaleString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Healthcare AI Analysis Report - ${patient.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #0066CC; padding-bottom: 20px; margin-bottom: 30px; }
        .patient-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .prediction { border-left: 4px solid #0066CC; padding: 15px; margin: 10px 0; background: #f8f9fa; }
        .confidence { color: #28a745; font-weight: bold; }
        .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 40px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>GOD LEVEL Healthcare AI Platform</h1>
        <h2>Patient Analysis Report</h2>
        <p>Generated on: ${timestamp}</p>
      </div>
      
      <div class="patient-info">
        <h3>Patient Information</h3>
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Age:</strong> ${patient.age}</p>
        <p><strong>Gender:</strong> ${patient.gender}</p>
        <p><strong>Blood Pressure:</strong> ${patient.bp_systolic}/${patient.bp_diastolic} mmHg</p>
        <p><strong>Heart Rate:</strong> ${patient.heart_rate} bpm</p>
        <p><strong>Glucose Level:</strong> ${patient.glucose} mg/dL</p>
        <p><strong>BMI:</strong> ${patient.bmi}</p>
      </div>
      
      <h3>AI Predictions</h3>
      ${predictions.map(pred => `
        <div class="prediction">
          <h4>${pred.disease} <span class="confidence">${(pred.confidence * 100).toFixed(1)}%</span></h4>
          <p><strong>Risk Factors:</strong> ${pred.risk_factors.join(', ')}</p>
          <p><strong>Symptoms:</strong> ${pred.symptoms.join(', ')}</p>
        </div>
      `).join('')}
      
      <div class="footer">
        <p><strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical consultation. Please consult with a healthcare provider for proper diagnosis and treatment.</p>
        <p>Generated by GOD LEVEL Healthcare AI Platform v2.0</p>
      </div>
    </body>
    </html>
  `;
}

function downloadReport(content, filename) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Notification System
function showNotification(message, type = 'info') {
  console.log('Notification:', message, type);
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <i class="fas fa-${getNotificationIcon(type)}"></i>
    <span>${message}</span>
  `;
  
  // Style notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: getNotificationColor(type),
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: '3000',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    fontSize: '14px',
    maxWidth: '400px'
  });
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 4000);
}

function getNotificationIcon(type) {
  switch(type) {
    case 'success': return 'check-circle';
    case 'error': return 'exclamation-circle';
    case 'warning': return 'exclamation-triangle';
    default: return 'info-circle';
  }
}

function getNotificationColor(type) {
  switch(type) {
    case 'success': return '#28a745';
    case 'error': return '#dc3545';
    case 'warning': return '#ffc107';
    default: return '#17a2b8';
  }
}

// Utility Functions
function formatNumber(num, decimals = 0) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function getVitalStatus(value, type) {
  const ranges = AppData.vital_ranges[type];
  if (!ranges || !value) return 'unknown';
  
  for (let [status, range] of Object.entries(ranges)) {
    if (value >= range[0] && value <= range[1]) {
      return status;
    }
  }
  return 'abnormal';
}