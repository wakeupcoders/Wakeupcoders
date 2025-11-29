// Fetch products from Supabase and render cards into the products page
(function(){
  const SUPABASE_URL = 'https://wesoxcshofuhvxwqagah.supabase.co/rest/v1/products?select=*';
  const SUPABASE_APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';
  const SUPABASE_AUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';

  function createCard(product){
    const link = product.product_link || '#';
    const rawImg = product.product_image || '';
    const placeholder = 'https://img.freepik.com/free-vector/abstract-grunge-style-coming-soon-with-black-splatter_1017-26690.jpg';
    const imgSrc = (typeof rawImg === 'string' && rawImg.trim()) ? rawImg.trim() : placeholder;
    const name = product.title || 'Product';
    const desc = product.description || '';

    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="ts-blog-thumb shadow p-3 mb-5 bg-white rounded">
        <a href="#" class="ts-blog-image" target="_blank" rel="noopener">
          <div class="">
            <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(name)}">
          </div>
        </a>
        <h4><a href="#" target="_blank" rel="noopener">${escapeHtml(name)}</a></h4>
        <p style="text-align:justify">${escapeHtml(desc)}</p>
        <a href="#" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Explore</a>
      </div>
    `;
    // set hrefs and image src via DOM
    const anchors = col.querySelectorAll('a');
    if (anchors[0]) anchors[0].href = link;
    if (anchors[1]) anchors[1].href = link;
    if (anchors[2]) anchors[2].href = link;
    const imgEl = col.querySelector('img');
    if (imgEl) {
      imgEl.src = imgSrc;
      imgEl.onerror = function(){ this.onerror = null; this.src = placeholder; };
      imgEl.style.width = '100%';
      imgEl.style.height = '245px';
      imgEl.style.objectFit = 'cover';
      imgEl.classList.add('img-fluid');
      const imgWrapEl = col.querySelector('.ts-background-image');
      if (imgWrapEl) {
        imgWrapEl.style.height = '200px';
        imgWrapEl.style.overflow = 'hidden';
      }
    }
    return col;
  }

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
    // Locate the products cards row: the first .ts-block section with multiple .ts-blog-thumb children
    var targetRow = document.querySelector('main#ts-content section.ts-block .container > .row');
    if (!targetRow) {
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
      try { console.log('products response', data); } catch (e) { /* ignore */ }
      if (!Array.isArray(data) || data.length === 0){
        const msg = document.createElement('div');
        msg.className = 'col-12';
        msg.innerHTML = '<p>No products found.</p>';
        targetRow.appendChild(msg);
        return;
      }
      data.forEach(product => {
        const card = createCard(product);
        targetRow.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error fetching products from Supabase:', err);
      const msg = document.createElement('div');
      msg.className = 'col-12';
      msg.innerHTML = '<p>Error loading products.</p>';
      targetRow.appendChild(msg);
    });
  });
})();
