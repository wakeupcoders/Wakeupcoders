// Read certificate id from query string
const urlParams = new URLSearchParams(window.location.search);
const paramValue = urlParams.get('cert');

// Supabase REST endpoint - uses certification_id equality filter
const SUPABASE_URL = 'https://wesoxcshofuhvxwqagah.supabase.co/rest/v1/certificates';
const SUPABASE_APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';
const SUPABASE_AUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';

function celebrate(){
  // trigger confetti
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 500,
      spread: 120,
      origin: { y: 0.6 }
    });
  }
}

// Helper: show "not found" alert and optionally redirect to contact
function showNotFound() {
  Swal.fire({
    title: "Oops!! No Certificate Found",
    text: "Please Contact Admin For Clarification.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Contact Admin"
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = 'https://wakeupcoders.com/contact';
    }
  });
}

// If no cert provided, show not found
if (!paramValue) {
  showNotFound();
} else {
  // Build Supabase filter URL for certification_id equality
  const url = `${SUPABASE_URL}?certification_id=eq.${encodeURIComponent(paramValue)}`;

  fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_APIKEY,
      'Authorization': SUPABASE_AUTH,
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    // Supabase returns an array of records; use the first if available
    if (!Array.isArray(data) || data.length === 0) {
      showNotFound();
      return;
    }

    const jsonData = data[0];
    const certContainer = document.querySelector('.cert-container');
    if (certContainer) certContainer.style.display = 'block';
    const invalidEl = document.getElementById('invalid');
    if (invalidEl) invalidEl.style.display = 'none';

    // Map fields from Supabase record to page elements (guarding missing fields)
    document.getElementById('cert-id').innerHTML = `Certificate Id: <span>${jsonData.certification_id || ''}</span>`;
    document.getElementById('host-server-id').innerHTML = `Hosting Server Id: <span>${jsonData.Server_id || ''}</span>`;
    document.getElementById('lms-id').innerHTML = `Learning Management System Id: <span>${jsonData.lms_id || ''}</span>`;
    document.getElementById('user-id-string').innerHTML = `User Id: <span>${jsonData.user_id || ''}</span>`;

    // Name and title fields - some DB columns may differ in naming
    try {
      const firstNameEl = document.querySelector('h2 span:first-child');
      const lastNameEl = document.querySelector('h2 span:last-child');
      if (firstNameEl) firstNameEl.innerHTML = jsonData['First Name'] || jsonData.first_name || jsonData.firstName || '';
      if (lastNameEl) lastNameEl.innerHTML = jsonData['Last Name'] || jsonData.last_name || jsonData.lastName || '';
    } catch (e) { /* ignore if selectors not present */ }

    document.getElementById('course-id-string').innerHTML = `Course Id: <span>${jsonData.course_id || ''}</span>`;
    const h1span = document.querySelector('h1 span');
    if (h1span) h1span.innerHTML = jsonData['Course Title'] || jsonData.course_title || jsonData.courseTitle || '';
    document.getElementById('certification_date').innerHTML = `<span>${jsonData.certification_date || ''}</span>`;
    const verifyLinkEl = document.getElementById('verifyLink');
    if (verifyLinkEl) verifyLinkEl.innerHTML = `wakeupcoders.com/verify?cert=${paramValue}`;

    // celebrate a bit
    setTimeout(() => { celebrate(); }, 1000);
    setTimeout(() => { celebrate(); }, 3000);
  })
  .catch(err => {
    console.error('Error fetching certificate from Supabase:', err);
    showNotFound();
  });
}




