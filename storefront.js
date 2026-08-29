/**
 * DÉPANNEUR EILIKA — STOREFRONT ENGINE
 * Pure Vanilla JavaScript • Direct WhatsApp Checkout • Live Status
 */

(function () {
  'use strict';

  // Application State
  let storeData = null;
  let cart = JSON.parse(localStorage.getItem('depanneur_cart') || '[]');
  let activeCategory = 'all';
  let searchQuery = '';

  // DOM Elements
  const headerCartBtn = document.getElementById('headerCartBtn');
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const floatingCartTotalEl = document.getElementById('floatingCartTotal');
  const btnWhatsAppCheckout = document.getElementById('btnWhatsAppCheckout');
  const liveStatusBadge = document.getElementById('liveStatusBadge');
  const marqueeContent = document.getElementById('marqueeContent');
  const featuredGrid = document.getElementById('featuredGrid');
  const impulseTrack = document.getElementById('impulseTrack');
  const categoryChipsContainer = document.getElementById('categoryChipsContainer');
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const resultsCountText = document.getElementById('resultsCountText');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const impulseTrackContainer = document.getElementById('impulseTrackContainer');

  // Customer Form Elements
  const custNameInput = document.getElementById('custName');
  const custPhoneInput = document.getElementById('custPhone');
  const custNoteInput = document.getElementById('custNote');
  const deliveryTypeRadios = document.getElementsByName('deliveryType');

  // 1. Initialize Application
  async function init() {
    await loadStoreData();
    setupLiveStatus();
    renderStoreInfo();
    renderMarquee();
    renderCategoryChips();
    renderFeaturedDeals();
    renderImpulseCarousel();
    renderCatalogGrid();
    updateCartUI();
    setupEventListeners();
  }

  // 2. Load Store Data (LocalStorage Cache or data.json)
  async function loadStoreData() {
    try {
      const cached = localStorage.getItem('depanneur_store_data');
      if (cached) {
        storeData = JSON.parse(cached);
      } else {
        const res = await fetch('./data.json?t=' + Date.now());
        if (!res.ok) throw new Error('Failed to fetch data.json');
        storeData = await res.json();
        localStorage.setItem('depanneur_store_data', JSON.stringify(storeData));
      }
    } catch (err) {
      console.warn('Using fallback memory data:', err);
      storeData = getFallbackData();
    }
  }

  // 3. Live "OUVERT / FERMÉ" Status Calculator
  function setupLiveStatus() {
    function updateStatus() {
      if (!storeData || !storeData.store) return;
      const now = new Date();
      const currentHour = now.getHours();
      const openHour = storeData.store.openingHour !== undefined ? storeData.store.openingHour : 8;
      const closeHour = storeData.store.closingHour !== undefined ? storeData.store.closingHour : 23;

      const isOpen = currentHour >= openHour && currentHour < closeHour;

      if (liveStatusBadge) {
        if (isOpen) {
          liveStatusBadge.className = 'neon-status-badge open';
          liveStatusBadge.innerHTML = `<span class="neon-dot"></span><span>OUVERT / OPEN • ${openHour}h-${closeHour}h</span>`;
        } else {
          liveStatusBadge.className = 'neon-status-badge closed';
          liveStatusBadge.innerHTML = `<span class="neon-dot"></span><span>FERMÉ / CLOSED • Ouvre à ${openHour}h</span>`;
        }
      }
    }
    updateStatus();
    setInterval(updateStatus, 30000);
  }

  // 4. Render Store Info & Titles
  function renderStoreInfo() {
    if (!storeData || !storeData.store) return;
    const s = storeData.store;
    
    document.querySelectorAll('.store-name-text').forEach(el => el.textContent = s.name);
    document.querySelectorAll('.store-tagline-text').forEach(el => el.textContent = s.tagline);
    
    const addrEl = document.getElementById('storeAddressText');
    if (addrEl) addrEl.textContent = s.address;
    
    const mapLinkEl = document.getElementById('storeMapLink');
    if (mapLinkEl) mapLinkEl.href = s.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(s.address)}`;
    
    const phoneEl = document.getElementById('storePhoneText');
    if (phoneEl) {
      phoneEl.textContent = s.phone;
      phoneEl.href = `tel:${s.phone.replace(/[^0-9+]/g, '')}`;
    }
    
    const waEl = document.getElementById('storeWhatsAppText');
    if (waEl) {
      waEl.textContent = s.whatsappFormatted || s.whatsappNumber;
      waEl.href = `https://wa.me/${s.whatsappNumber}`;
    }

    const hoursEl = document.getElementById('storeHoursText');
    if (hoursEl) hoursEl.textContent = s.hoursFormatted || `${s.openingHour}h00 - ${s.closingHour}h00`;
  }

  // 5. Render Scrolling Announcement Marquee
  function renderMarquee() {
    if (!marqueeContent || !storeData || !storeData.store) return;
    const items = storeData.store.announcements || [
      "✨ BIENVENUE AU DÉPANNEUR EILIKA — LIVRAISON LOCALE & RAMASSAGE VIA WHATSAPP!",
      "⚡ RABAIS DE 15% SUR LES BOISSONS ET SNACKS VEDETTES CETTE SEMAINE!"
    ];

    // Double the items for seamless infinite scroll
    const combined = [...items, ...items];
    marqueeContent.innerHTML = combined.map(item => `
      <div class="marquee-item">
        <span>${item}</span>
        <span class="marquee-divider">✦</span>
      </div>
    `).join('');
  }

  // 6. Render Section A: Featured Deals
  function renderFeaturedDeals() {
    if (!featuredGrid || !storeData) return;
    const featured = storeData.products.filter(p => p.isFeatured || p.discount);
    
    if (featured.length === 0) {
      featuredGrid.innerHTML = `<p style="grid-column:1/-1; color:#64748B;">No featured items right now.</p>`;
      return;
    }

    featuredGrid.innerHTML = featured.slice(0, 4).map(p => `
      <div class="deal-card" id="card-${p.id}">
        <div class="card-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
          ${p.badge ? `<span class="deal-badge-tag">${p.badge}</span>` : ''}
          ${p.discount ? `<span class="deal-discount-tag">${p.discount}</span>` : ''}
        </div>
        <div class="card-body">
          <span class="card-category-tag">${getCategoryName(p.category)}</span>
          <h3 class="card-title">${p.name}</h3>
          <p class="card-desc">${p.description || p.nameFr || ''}</p>
          <div class="card-footer">
            <div class="price-box">
              <span class="price-current">$${Number(p.price).toFixed(2)} CAD</span>
              ${p.originalPrice ? `<span class="price-original">$${Number(p.originalPrice).toFixed(2)}</span>` : ''}
            </div>
            <button class="btn-add-order" data-id="${p.id}" onclick="window.DepanneurApp.addToCart('${p.id}')">
              <span>+ WhatsApp Order</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 7. Render Section B: Impulse Buy Mini Carousel
  function renderImpulseCarousel() {
    if (!impulseTrack || !storeData) return;
    const impulses = storeData.products.filter(p => p.isImpulse || p.price < 4.00);

    impulseTrack.innerHTML = impulses.map(p => `
      <div class="mini-card" id="mini-${p.id}">
        <div class="mini-card-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
        </div>
        <h4 class="mini-card-title">${p.name}</h4>
        <div class="mini-card-footer">
          <span class="mini-price">$${Number(p.price).toFixed(2)}</span>
          <button class="btn-quick-add" title="Add to Order" onclick="window.DepanneurApp.addToCart('${p.id}')">+</button>
        </div>
      </div>
    `).join('');
  }

  // 8. Render Category Filter Chips
  function renderCategoryChips() {
    if (!categoryChipsContainer || !storeData) return;
    const cats = storeData.categories || [];

    categoryChipsContainer.innerHTML = cats.map(c => `
      <button class="filter-chip ${activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
        <span>${c.name}</span>
      </button>
    `).join('');

    // Attach click events
    categoryChipsContainer.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        renderCategoryChips();
        renderCatalogGrid();
      });
    });
  }

  // 9. Render Section C: Standard Catalog Grid
  function renderCatalogGrid() {
    if (!productsGrid || !storeData) return;

    let filtered = storeData.products;

    // Filter by Category
    if (activeCategory === 'deals') {
      filtered = filtered.filter(p => p.isFeatured || p.discount);
    } else if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.nameFr && p.nameFr.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (resultsCountText) {
      resultsCountText.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'} available`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-results-box">
          <h3>Aucun produit trouvé / No products found</h3>
          <p style="color:#64748B; font-size:0.9rem; margin-top:0.3rem;">Essayez un autre mot-clé ou sélectionnez une autre catégorie.</p>
          <button class="btn-add-order" style="margin-top:1rem;" onclick="window.DepanneurApp.resetFilters()">Voir tous les produits</button>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => `
      <div class="product-card" id="prod-card-${p.id}">
        <div class="product-card-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
          ${p.badge ? `<span class="badge-tag-small">${p.badge}</span>` : ''}
        </div>
        <div class="card-body">
          <span class="card-category-tag">${getCategoryName(p.category)}</span>
          <h3 class="card-title">${p.name}</h3>
          <p class="card-desc">${p.description || p.nameFr || ''}</p>
          <div class="card-footer">
            <div class="price-box">
              <span class="price-current">$${Number(p.price).toFixed(2)} CAD</span>
              ${p.originalPrice ? `<span class="price-original">$${Number(p.originalPrice).toFixed(2)}</span>` : ''}
            </div>
            <button class="btn-add-order" onclick="window.DepanneurApp.addToCart('${p.id}')">
              <span>+ Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function getCategoryName(catId) {
    if (!storeData || !storeData.categories) return catId;
    const found = storeData.categories.find(c => c.id === catId);
    return found ? found.name.split('/')[0].trim() : catId;
  }

  // 10. Cart Management
  function addToCart(productId) {
    if (!storeData) return;
    const product = storeData.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      });
    }

    saveCart();
    updateCartUI();
    triggerCartBounce();
    openCartDrawer();
  }

  function updateQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }

    saveCart();
    updateCartUI();
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem('depanneur_cart', JSON.stringify(cart));
  }

  function triggerCartBounce() {
    cartCountBadges.forEach(b => {
      b.classList.remove('cart-bounce');
      void b.offsetWidth; // trigger reflow
      b.classList.add('cart-bounce');
    });
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update count badges
    cartCountBadges.forEach(b => b.textContent = totalCount);

    // Update floating total
    if (floatingCartTotalEl) {
      floatingCartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
    }
    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `$${totalPrice.toFixed(2)} CAD`;
    }
    if (cartTotalEl) {
      cartTotalEl.textContent = `$${totalPrice.toFixed(2)} CAD`;
    }

    // Toggle Floating Bubble visibility
    if (floatingCartBtn) {
      floatingCartBtn.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // Render Items in Drawer
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">🛒</div>
          <h4 style="font-weight:700; color:#1E293B;">Votre panier est vide</h4>
          <p style="font-size:0.85rem; margin-top:0.25rem;">Ajoutez des boissons fraîches, snacks ou essentiels pour commander via WhatsApp!</p>
        </div>
      `;
      if (btnWhatsAppCheckout) {
        btnWhatsAppCheckout.disabled = true;
        btnWhatsAppCheckout.style.opacity = '0.5';
        btnWhatsAppCheckout.style.cursor = 'not-allowed';
      }
      return;
    }

    if (btnWhatsAppCheckout) {
      btnWhatsAppCheckout.disabled = false;
      btnWhatsAppCheckout.style.opacity = '1';
      btnWhatsAppCheckout.style.cursor = 'pointer';
    }

    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item-row" id="cart-item-${item.id}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-unit-price">$${Number(item.price).toFixed(2)} ch.</div>
        </div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="window.DepanneurApp.updateQuantity('${item.id}', -1)">−</button>
          <span class="qty-count">${item.quantity}</span>
          <button class="qty-btn" onclick="window.DepanneurApp.updateQuantity('${item.id}', 1)">+</button>
        </div>
        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="cart-item-remove" title="Supprimer" onclick="window.DepanneurApp.removeFromCart('${item.id}')">✕</button>
      </div>
    `).join('');
  }

  // 11. WhatsApp Checkout Formatter & Launcher
  function processWhatsAppCheckout() {
    if (cart.length === 0) {
      alert('Veuillez ajouter des articles à votre commande avant de continuer.');
      return;
    }

    const customerName = (custNameInput && custNameInput.value.trim()) || 'Client Anonyme';
    const customerPhone = (custPhoneInput && custPhoneInput.value.trim()) || 'Non spécifié';
    const customerNote = (custNoteInput && custNoteInput.value.trim()) || 'Aucune note';
    
    let deliveryMode = 'Livraison locale (Plateau / Mile-End)';
    if (deliveryTypeRadios) {
      for (const r of deliveryTypeRadios) {
        if (r.checked) {
          deliveryMode = r.value;
          break;
        }
      }
    }

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const store = (storeData && storeData.store) ? storeData.store : { name: "Dépanneur Eilika", whatsappNumber: "15145550199" };

    // Format Structured WhatsApp Order Message
    let msg = `🛍️ *NOUVELLE COMMANDE — ${store.name.toUpperCase()}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Client:* ${customerName}\n`;
    msg += `📞 *Téléphone:* ${customerPhone}\n`;
    msg += `📍 *Mode:* ${deliveryMode}\n`;
    msg += `🏠 *Adresse / Détails:* ${customerNote}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `🛒 *ARTICLES COMMANDÉS (${totalCount}):*\n`;

    cart.forEach((item, index) => {
      const itemSubtotal = (item.price * item.quantity).toFixed(2);
      msg += `${index + 1}. *${item.quantity}x* ${item.name} — $${itemSubtotal} CAD\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *SOUS-TOTAL:* $${totalPrice.toFixed(2)} CAD\n`;
    msg += `💵 *TOTAL ESTIMÉ:* $${totalPrice.toFixed(2)} CAD\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Merci! Commande générée via Dépanneur Eilika WhatsApp Checkout_`;

    const waNumber = store.whatsappNumber || "15145550199";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');
  }

  // 12. Drawer & Navigation Handlers
  function openCartDrawer() {
    if (cartDrawer) cartDrawer.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
  }

  function closeMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    if (drawerBackdrop && (!cartDrawer || !cartDrawer.classList.contains('active'))) {
      drawerBackdrop.classList.remove('active');
    }
  }

  // 13. Event Listeners
  function setupEventListeners() {
    if (headerCartBtn) headerCartBtn.addEventListener('click', openCartDrawer);
    if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCartDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeCartDrawer);
    
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', () => {
        closeCartDrawer();
        closeMobileNav();
      });
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
    if (closeMobileNavBtn) closeMobileNavBtn.addEventListener('click', closeMobileNav);

    if (btnWhatsAppCheckout) {
      btnWhatsAppCheckout.addEventListener('click', processWhatsAppCheckout);
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCatalogGrid();
      });
    }

    // Impulse Carousel Scroll Buttons
    if (carouselPrevBtn && impulseTrackContainer) {
      carouselPrevBtn.addEventListener('click', () => {
        impulseTrackContainer.scrollBy({ left: -220, behavior: 'smooth' });
      });
    }
    if (carouselNextBtn && impulseTrackContainer) {
      carouselNextBtn.addEventListener('click', () => {
        impulseTrackContainer.scrollBy({ left: 220, behavior: 'smooth' });
      });
    }
  }

  // Fallback Data in case data.json fetch fails
  function getFallbackData() {
    return {
      store: {
        name: "Dépanneur Eilika",
        tagline: "Votre dépanneur de quartier à Montréal",
        address: "4218 Rue Saint-Denis, Plateau-Mont-Royal, Montréal, QC H2J 2K8",
        mapsUrl: "https://maps.google.com/?q=4218+Rue+Saint-Denis+Montreal",
        phone: "+1 (514) 555-0199",
        whatsappNumber: "15145550199",
        openingHour: 8,
        closingHour: 23,
        announcements: ["✨ BIENVENUE AU DÉPANNEUR EILIKA — LIVRAISON LOCALE SUR LE PLATEAU VIA WHATSAPP!"]
      },
      categories: [
        { id: "all", name: "All / Tous" },
        { id: "drinks", name: "Drinks / Boissons" },
        { id: "snacks", name: "Snacks & Chips" },
        { id: "smoking", name: "Lighters & Smoking" },
        { id: "health", name: "Health & Essentials" }
      ],
      products: []
    };
  }

  // Expose Global Namespace for inline triggers
  window.DepanneurApp = {
    addToCart,
    updateQuantity,
    removeFromCart,
    openCartDrawer,
    closeCartDrawer,
    resetFilters: () => {
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      renderCategoryChips();
      renderCatalogGrid();
    }
  };

  // Launch on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
