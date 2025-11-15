// Fetch partners from Supabase and render cards into the partners page
(function(){
  const SUPABASE_URL = 'https://wesoxcshofuhvxwqagah.supabase.co/rest/v1/partners?select=*';
  const SUPABASE_APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';
  const SUPABASE_AUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';

  function createCard(partner){
    // simple card builder: use innerHTML for structure, but set href/src via DOM to avoid quoting/escaping issues
    const link = partner.link || partner.url || '#';
    const rawImg = partner.img_url || partner.image || partner.logo || partner.image_url || partner.img || '';
    const placeholder = 'https://img.freepik.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg?semt=ais_hybrid&w=740&q=80';
    const imgSrc = (typeof rawImg === 'string' && rawImg.trim()) ? rawImg.trim() : placeholder;
    const name = partner.name || partner.title || partner.partner_name || 'Partner';
    const desc = partner.description || partner.summary || '';

    const col = document.createElement('div');
    col.className = 'col-md-4';

    col.innerHTML = `
      <div class="ts-blog-thumb shadow p-3 mb-5 bg-white rounded">
        <a href="#" class="ts-blog-image ts-background" target="_blank" rel="noopener">
         
            <img src="" alt="${escapeHtml(name)}">
         
        </a>
        <h4><a href="#" target="_blank" rel="noopener">${escapeHtml(name)}</a></h4>
        <p style="text-align:justify">${escapeHtml(desc)}</p>
        <a href="#" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Explore</a>
        <button class="btn btn-outline-dark btn-sm">Case Study</button>
      </div>
    `;

    // set hrefs and image src via DOM to avoid any attribute-escaping problems
    const anchors = col.querySelectorAll('a');
    if (anchors[0]) anchors[0].href = link; // image link
    if (anchors[1]) anchors[1].href = link; // title link
    if (anchors[2]) anchors[2].href = link; // explore

    const imgEl = col.querySelector('img');
    if (imgEl) {
      imgEl.src = imgSrc;
      imgEl.onerror = function(){ this.onerror = null; this.src = placeholder; };
      // Ensure the image fits inside the card box without overflowing.
      // Use object-fit to keep aspect ratio and a fixed height for consistency.
      imgEl.style.width = '100%';
      imgEl.style.height = '245px';
      imgEl.style.objectFit = 'cover';
      imgEl.classList.add('img-fluid');
      // Make sure the wrapper doesn't expand beyond the intended height
      const imgWrapEl = col.querySelector('.ts-background-image');
      if (imgWrapEl) {
        imgWrapEl.style.height = '200px';
        imgWrapEl.style.overflow = 'hidden';
      }
    }

    return col;
  }

  // Minimal HTML escape to avoid injecting raw HTML from API
  function escapeHtml(str){
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Locate the partners cards row: the first .ts-block section with multiple .ts-blog-thumb children
    var targetRow = document.querySelector('main#ts-content section.ts-block .container > .row');
    if (!targetRow) {
      // fallback: any .row inside main
      targetRow = document.querySelector('main#ts-content .row');
    }
    if (!targetRow) return;

    // Optionally clear existing static cards
    targetRow.innerHTML = '';

    fetch(SUPABASE_URL, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_APIKEY,
        'Authorization': SUPABASE_AUTH,
        'Accept': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      // Log raw response to help verify field names/values when debugging
      try { console.log('partners response', data); } catch (e) { /* ignore */ }
      if (!Array.isArray(data) || data.length === 0){
        // show fallback message
        const msg = document.createElement('div');
        msg.className = 'col-12';
        msg.innerHTML = '<p>No partners found.</p>';
        targetRow.appendChild(msg);
        return;
      }

      data.forEach(partner => {
        const card = createCard(partner);
        targetRow.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error fetching partners from Supabase:', err);
      const msg = document.createElement('div');
      msg.className = 'col-12';
      msg.innerHTML = '<p>Error loading partners.</p>';
      targetRow.appendChild(msg);
    });
  });
})();
