(function(){
  const SUPABASE_URL = 'https://wesoxcshofuhvxwqagah.supabase.co/rest/v1/courses?select=*';
  const SUPABASE_APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';
  const SUPABASE_AUTH   = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';

  // ESCAPE HTML
  function escapeHtml(str){
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // BUILD CARD HTML
  function createCourseCard(course){
    const col = document.createElement('div');
    col.className = 'col-md-4';

    const imgSrc  = course.course_image || 'https://via.placeholder.com/400x250?text=No+Image';
    const title = escapeHtml(course.title);
    const desc  = escapeHtml(course.description || '');
    const link  = course.course_link || '#';
    const demo  = course.free_demo_link || '#';

    col.innerHTML = `
      <div class="ts-blog-thumb shadow p-3 mb-5 bg-white rounded">
        <a href="${link}" class="ts-blog-image ts-background" target="_blank" rel="noopener">
            <img src="${imgSrc}" alt="${title}" class="img-fluid" style="height:250px; width:400px; object-fit:cover;">
        </a>

        <h4>
            <a href="${link}" target="_blank" rel="noopener">${title}</a>
        </h4>

        <p style="text-align:justify">${desc}</p>

        <div class="btn-group">
            <a href="${demo}" class="btn btn-outline-dark btn-sm" target="_blank" rel="noopener">Free Demo</a>
            <a href="${link}" class="btn btn-dark btn-sm" target="_blank" rel="noopener">Know More</a>
        </div>
      </div>
    `;

    return col;
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Target row where cards will be inserted  
    let targetRow = document.querySelector('#courses-row');
    if (!targetRow) {
        targetRow = document.querySelector('main#ts-content .row');
    }
    if (!targetRow) return;

    // Clear static content
    targetRow.innerHTML = '';

    // Fetch courses
    fetch(SUPABASE_URL, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_APIKEY,
        'Authorization': SUPABASE_AUTH,
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log('courses response', data);

      if (!Array.isArray(data) || data.length === 0){
        targetRow.innerHTML = '<div class="col-12"><p>No courses found.</p></div>';
        return;
      }

      data.forEach(course => {
        const card = createCourseCard(course);
        targetRow.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error fetching courses:', err);
      targetRow.innerHTML = '<div class="col-12"><p>Error loading courses.</p></div>';
    });

  });
})();
