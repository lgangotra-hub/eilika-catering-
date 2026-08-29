/**
 * DÉPANNEUR EILIKA — STOREFRONT CLIENT ENGINE
 * Pure Vanilla JavaScript • Direct WhatsApp Checkout • Official Glossy Theme
 * Bilingual English / French Language Switcher • Zero Red Styling
 */

(function () {
  'use strict';

  // State Management
  let storeData = null;
  let cart = [];
  let currentLang = localStorage.getItem('depanneur_lang') || 'fr';
  let activeCategory = 'all';
  let searchQuery = '';

  // DOM Elements
  const headerCartBtn = document.getElementById('headerCartBtn');
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
  
  const featuredGrid = document.getElementById('featuredGrid');
  const impulseTrack = document.getElementById('impulseTrack');
  const impulseTrackContainer = document.getElementById('impulseTrackContainer');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  
  const categoryChipsContainer = document.getElementById('categoryChipsContainer');
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const resultsCountText = document.getElementById('resultsCountText');
  
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const floatingCartTotalEl = document.getElementById('floatingCartTotal');
  const cartCountBadges = [
    document.getElementById('headerCartCount'),
    document.getElementById('floatingBadge')
  ].filter(Boolean);

  const btnWhatsAppCheckout = document.getElementById('btnWhatsAppCheckout');
  const custNameInput = document.getElementById('custName');
  const custPhoneInput = document.getElementById('custPhone');
  const custNoteInput = document.getElementById('custNote');
  const deliveryTypeRadios = document.getElementsByName('deliveryType');
  const marqueeContent = document.getElementById('marqueeContent');

  // Translation Dictionary
  const I18N = {
    fr: {
      langCode: 'fr-CA',
      tagline: 'Épicerie Fine & Dépanneur Officiel • Plateau-Mont-Royal',
      statusOpen: 'OUVERT / OPEN • 08h-23h',
      statusClosed: 'FERMÉ / CLOSED',
      navDeals: '⚡ Aubaines',
      navImpulse: '🔥 Achats Express',
      navCatalog: '📦 Rayons',
      navAdmin: '⚙️ Admin',
      cartLabel: 'Panier',
      dealsTitle: 'Aubaines de la Semaine / Top Deals',
      dealsSubtitle: 'Sélection de boissons fraîches, collations et rabais spéciaux',
      impulseTitle: 'Achats Express & Essentiels de Poche',
      impulseSubtitle: 'Briquets, gommes, mouchoirs et petits délices à portée de main',
      catalogTitle: 'Tous les Rayons du Dépanneur',
      catalogSubtitle: 'Trouvez rapidement ce dont vous avez besoin',
      searchPlaceholder: 'Rechercher chips, Red Bull, briquets, Advil...',
      resultsCount: (count) => `${count} article${count === 1 ? '' : 's'} disponible${count === 1 ? '' : 's'}`,
      noProductsFound: 'Aucun produit trouvé',
      noProductsDesc: 'Essayez un autre mot-clé ou sélectionnez une autre catégorie.',
      resetFiltersBtn: 'Voir tous les produits',
      addToCartBtn: '+ Ajouter au panier',
      drawerTitle: 'Votre Commande WhatsApp',
      drawerInfoTitle: 'Informations de Commande',
      lblName: 'Votre Nom *',
      lblPhone: 'Numéro de téléphone',
      lblDelivery: 'Option de réception / Mode',
      optDelivery: '🚲 Livraison Locale',
      optPickup: '🏪 Ramassage en Magasin',
      lblNote: 'Adresse de livraison ou note au commis',
      subtotalLabel: 'Sous-total:',
      totalLabel: 'Total Estimé:',
      checkoutBtn: 'Commander via WhatsApp',
      checkoutSecureNote: '🔒 Envoi direct sans intermédiaire • Paiement au ramassage ou livraison',
      emptyCartTitle: 'Votre panier est vide',
      emptyCartDesc: 'Ajoutez des boissons fraîches, snacks ou essentiels pour commander via WhatsApp!',
      hoursTitle: 'Heures & Emplacement',
      hoursDetail: '🕒 Ouvert 7 jours sur 7: 08h00 à 23h00',
      deliveryDetail: '🚲 Livraison locale Plateau / Mile-End',
      paymentsTitle: 'Paiements & Commandes',
      payCash: '💵 Comptant / Cash',
      payCards: '💳 Interac, Visa, Mastercard, Apple Pay',
      payWhatsapp: '📱 WhatsApp Checkout Express',
      rights: 'Tous droits réservés.',
      adminBtn: 'Tableau de bord Admin',
      categories: {
        all: 'Tous les Rayons',
        deals: '⚡ Aubaines',
        drinks: 'Boissons Fraîches',
        snacks: 'Snacks & Chips',
        smoking: 'Briquets & Articles',
        health: 'Santé & Essentiels',
        general: 'Épicerie Générale'
      }
    },
    en: {
      langCode: 'en-CA',
      tagline: 'Fine Grocery & Official Convenience Store • Plateau-Mont-Royal',
      statusOpen: 'OPEN / OUVERT • 8 AM - 11 PM',
      statusClosed: 'CLOSED / FERMÉ',
      navDeals: '⚡ Top Deals',
      navImpulse: '🔥 Express Essentials',
      navCatalog: '📦 Catalog',
      navAdmin: '⚙️ Admin',
      cartLabel: 'Cart',
      dealsTitle: 'Weekly Deals & Featured Items',
      dealsSubtitle: 'Cold beverages, snacks and special daily discounts',
      impulseTitle: 'Quick Essentials & Impulse Counter',
      impulseSubtitle: 'Lighters, gums, tissues, candies and pocket essentials',
      catalogTitle: 'Full Convenience Store Catalog',
      catalogSubtitle: 'Find everything you need in seconds',
      searchPlaceholder: 'Search chips, Red Bull, lighters, Advil...',
      resultsCount: (count) => `${count} item${count === 1 ? '' : 's'} available`,
      noProductsFound: 'No products found',
      noProductsDesc: 'Try another search term or select a different category.',
      resetFiltersBtn: 'View all products',
      addToCartBtn: '+ Add to Cart',
      drawerTitle: 'Your WhatsApp Order',
      drawerInfoTitle: 'Order Information',
      lblName: 'Your Name *',
      lblPhone: 'Phone Number',
      lblDelivery: 'Fulfillment Method',
      optDelivery: '🚲 Local Delivery',
      optPickup: '🏪 In-Store Pickup',
      lblNote: 'Delivery address or note for the clerk',
      subtotalLabel: 'Subtotal:',
      totalLabel: 'Estimated Total:',
      checkoutBtn: 'Order via WhatsApp',
      checkoutSecureNote: '🔒 Direct ordering without intermediaries • Pay on delivery or pickup',
      emptyCartTitle: 'Your cart is empty',
      emptyCartDesc: 'Add cold drinks, snacks or essentials to order directly on WhatsApp!',
      hoursTitle: 'Hours & Location',
      hoursDetail: '🕒 Open 7 days a week: 8:00 AM to 11:00 PM',
      deliveryDetail: '🚲 Local delivery Plateau / Mile-End',
      paymentsTitle: 'Payment & Ordering',
      payCash: '💵 Cash accepted',
      payCards: '💳 Interac, Visa, Mastercard, Apple Pay',
      payWhatsapp: '📱 WhatsApp Checkout Express',
      rights: 'All rights reserved.',
      adminBtn: 'Admin Dashboard',
      categories: {
        all: 'All Categories',
        deals: '⚡ Top Deals',
        drinks: 'Cold Drinks',
        snacks: 'Snacks & Chips',
        smoking: 'Lighters & Smoking',
        health: 'Health & Essentials',
        general: 'General Grocery'
      }
    }
  };

  // 1. Initialize Storefront
  async function init() {
    loadCartFromStorage();
    await loadStoreData();
    applyLanguageUI(currentLang);
    setupLanguageSwitcher();
    renderStoreInfo();
    renderMarquee();
    renderFeaturedDeals();
    renderImpulseCarousel();
    renderCategoryChips();
    renderCatalogGrid();
    updateCartUI();
    setupEventListeners();
  }

  // 2. Load Store Data from localStorage or data.json
  async function loadStoreData() {
    try {
      const cached = localStorage.getItem('depanneur_store_data');
      if (cached) {
        storeData = JSON.parse(cached);
      } else {
        const res = await fetch('./data.json?t=' + Date.now());
        if (!res.ok) throw new Error('Could not load data.json');
        storeData = await res.json();
        localStorage.setItem('depanneur_store_data', JSON.stringify(storeData));
      }
    } catch (err) {
      console.warn('Using fallback data:', err);
      storeData = getFallbackData();
    }
  }

  // 3. Language Switcher Setup & Application
  function setupLanguageSwitcher() {
    const langBtn = document.getElementById('langToggleBtn');
    if (!langBtn) return;

    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      localStorage.setItem('depanneur_lang', currentLang);
      applyLanguageUI(currentLang);
      renderCategoryChips();
      renderFeaturedDeals();
      renderImpulseCarousel();
      renderCatalogGrid();
      updateCartUI();
    });
  }

  function applyLanguageUI(lang) {
    const t = I18N[lang] || I18N.fr;
    document.documentElement.lang = t.langCode;

    // Update active state on toggle button
    const optEn = document.getElementById('langOptEn');
    const optFr = document.getElementById('langOptFr');
    if (optEn && optFr) {
      optEn.classList.toggle('active', lang === 'en');
      optFr.classList.toggle('active', lang === 'fr');
    }

    // Static text elements
    const setElem = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setElem('storeTaglineSub', t.tagline);
    setElem('liveStatusText', t.statusOpen);
    setElem('navLinkDeals', t.navDeals);
    setElem('navLinkImpulse', t.navImpulse);
    setElem('navLinkCatalog', t.navCatalog);
    setElem('headerCartLabel', t.cartLabel);
    setElem('floatingCartLabel', `🛒 ${t.cartLabel}`);
    
    setElem('dealsSectionTitle', t.dealsTitle);
    setElem('dealsSectionSubtitle', t.dealsSubtitle);
    setElem('impulseSectionTitle', t.impulseTitle);
    setElem('impulseSectionSubtitle', t.impulseSubtitle);
    setElem('catalogSectionTitle', t.catalogTitle);
    setElem('catalogSectionSubtitle', t.catalogSubtitle);

    const searchInp = document.getElementById('searchInput');
    if (searchInp) searchInp.placeholder = t.searchPlaceholder;

    // Drawer elements
    setElem('drawerTitleText', t.drawerTitle);
    setElem('formInfoTitle', t.drawerInfoTitle);
    setElem('labelCustName', t.lblName);
    setElem('labelCustPhone', t.lblPhone);
    setElem('labelDeliveryType', t.lblDelivery);
    setElem('optDeliveryText', t.optDelivery);
    setElem('optPickupText', t.optPickup);
    setElem('labelCustNote', t.lblNote);
    setElem('subtotalLabelText', t.subtotalLabel);
    setElem('totalLabelText', t.totalLabel);
    setElem('btnWhatsAppText', t.checkoutBtn);
    setElem('checkoutNoteText', t.checkoutSecureNote);

    // Footer elements
    setElem('footerHoursTitle', t.hoursTitle);
    setElem('footerHoursDetail', t.hoursDetail);
    setElem('footerDeliveryDetail', t.deliveryDetail);
    setElem('footerPaymentsTitle', t.paymentsTitle);
    setElem('footerPayCash', t.payCash);
    setElem('footerPayCards', t.payCards);
    setElem('footerPayWhatsapp', t.payWhatsapp);
    setElem('footerRightsText', t.rights);
    setElem('footerAdminBtnText', t.adminBtn);
  }

  // 4. Render Store Info
  function renderStoreInfo() {
    if (!storeData || !storeData.store) return;
    const s = storeData.store;

    const brandHeading = document.getElementById('storeBrandHeading');
    if (brandHeading) brandHeading.textContent = s.name;

    const addressEl = document.getElementById('storeAddressText');
    if (addressEl) addressEl.textContent = s.address;

    const mapLink = document.getElementById('storeMapLink');
    if (mapLink && s.mapsUrl) mapLink.href = s.mapsUrl;

    const phoneEl = document.getElementById('storePhoneText');
    if (phoneEl && s.phone) {
      phoneEl.textContent = `📞 ${s.phone}`;
      phoneEl.href = `tel:${s.phone.replace(/[^0-9+]/g, '')}`;
    }

    const waEl = document.getElementById('storeWhatsAppText');
    if (waEl && s.whatsappNumber) {
      waEl.href = `https://wa.me/${s.whatsappNumber}`;
    }
  }

  // 5. Render Scrolling Announcement Marquee
  function renderMarquee() {
    if (!marqueeContent || !storeData || !storeData.store) return;
    const items = storeData.store.announcements || [
      "✨ BIENVENUE AU DÉPANNEUR EILIKA — LIVRAISON LOCALE & RAMASSAGE VIA WHATSAPP!",
      "⚡ RABAIS EXCLUSIFS SUR LES BOISSONS ET SNACKS VEDETTES CETTE SEMAINE!"
    ];

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
    const t = I18N[currentLang] || I18N.fr;
    const featured = storeData.products.filter(p => p.isFeatured || p.discount);

    if (featured.length === 0) {
      featuredGrid.innerHTML = `<p style="grid-column:1/-1; color:#64748B; padding:1rem;">Aucune aubaine active pour le moment.</p>`;
      return;
    }

    featuredGrid.innerHTML = featured.slice(0, 4).map(p => {
      const displayName = (currentLang === 'fr' && p.nameFr) ? p.nameFr : p.name;
      return `
        <div class="deal-card" id="card-${p.id}">
          <div class="card-img-wrap">
            <img src="${p.image}" alt="${displayName}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
            ${p.badge ? `<span class="deal-badge-tag">${p.badge}</span>` : ''}
            ${p.discount ? `<span class="deal-discount-tag">${p.discount}</span>` : ''}
          </div>
          <div class="card-body">
            <span class="card-category-tag">${getCategoryName(p.category)}</span>
            <h3 class="card-title">${displayName}</h3>
            <p class="card-desc">${p.description || ''}</p>
            <div class="card-footer">
              <div class="price-box">
                <span class="price-current">$${Number(p.price).toFixed(2)} CAD</span>
                ${p.originalPrice ? `<span class="price-original">$${Number(p.originalPrice).toFixed(2)}</span>` : ''}
              </div>
              <button class="btn-add-order" data-id="${p.id}" onclick="window.DepanneurApp.addToCart('${p.id}')">
                <span>${t.addToCartBtn}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 7. Render Section B: Impulse Buy Mini Carousel
  function renderImpulseCarousel() {
    if (!impulseTrack || !storeData) return;
    const impulses = storeData.products.filter(p => p.isImpulse || p.price < 4.00);

    impulseTrack.innerHTML = impulses.map(p => {
      const displayName = (currentLang === 'fr' && p.nameFr) ? p.nameFr : p.name;
      return `
        <div class="mini-card" id="mini-${p.id}">
          <div class="mini-card-img">
            <img src="${p.image}" alt="${displayName}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
          </div>
          <h4 class="mini-card-title">${displayName}</h4>
          <div class="mini-card-footer">
            <span class="mini-price">$${Number(p.price).toFixed(2)}</span>
            <button class="btn-quick-add" title="Ajouter / Add" onclick="window.DepanneurApp.addToCart('${p.id}')">+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 8. Render Category Filter Chips
  function renderCategoryChips() {
    if (!categoryChipsContainer || !storeData) return;
    const t = I18N[currentLang] || I18N.fr;
    const defaultCats = [
      { id: "all", name: t.categories.all },
      { id: "deals", name: t.categories.deals },
      { id: "drinks", name: t.categories.drinks },
      { id: "snacks", name: t.categories.snacks },
      { id: "smoking", name: t.categories.smoking },
      { id: "health", name: t.categories.health },
      { id: "general", name: t.categories.general }
    ];

    categoryChipsContainer.innerHTML = defaultCats.map(c => `
      <button class="filter-chip ${activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}" type="button">
        <span>${c.name}</span>
      </button>
    `).join('');

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
    const t = I18N[currentLang] || I18N.fr;
    let filtered = storeData.products || [];

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
      resultsCountText.textContent = t.resultsCount(filtered.length);
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-results-box" style="grid-column: 1 / -1; text-align:center; padding:3rem 1rem;">
          <h3 style="font-size:1.2rem; font-weight:800; color:var(--charcoal);">${t.noProductsFound}</h3>
          <p style="color:#64748B; font-size:0.9rem; margin-top:0.35rem;">${t.noProductsDesc}</p>
          <button class="btn-add-order" style="margin:1.25rem auto 0; display:inline-flex;" onclick="window.DepanneurApp.resetFilters()">
            <span>${t.resetFiltersBtn}</span>
          </button>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => {
      const displayName = (currentLang === 'fr' && p.nameFr) ? p.nameFr : p.name;
      return `
        <div class="product-card" id="prod-card-${p.id}">
          <div class="product-card-img">
            <img src="${p.image}" alt="${displayName}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
            ${p.badge ? `<span class="badge-tag-small">${p.badge}</span>` : ''}
            ${p.discount ? `<span class="deal-discount-tag" style="top:8px; left:8px;">${p.discount}</span>` : ''}
          </div>
          <div class="card-body">
            <span class="card-category-tag">${getCategoryName(p.category)}</span>
            <h3 class="card-title">${displayName}</h3>
            <p class="card-desc">${p.description || ''}</p>
            <div class="card-footer">
              <div class="price-box">
                <span class="price-current">$${Number(p.price).toFixed(2)} CAD</span>
                ${p.originalPrice ? `<span class="price-original">$${Number(p.originalPrice).toFixed(2)}</span>` : ''}
              </div>
              <button class="btn-add-order" onclick="window.DepanneurApp.addToCart('${p.id}')">
                <span>${t.addToCartBtn}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getCategoryName(catId) {
    const t = I18N[currentLang] || I18N.fr;
    return t.categories[catId] || catId;
  }

  // 10. Cart Management & Persistence
  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('depanneur_cart');
      if (saved) cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    localStorage.setItem('depanneur_cart', JSON.stringify(cart));
  }

  function addToCart(productId) {
    if (!storeData) return;
    const product = storeData.products.find(p => p.id === productId);
    if (!product) return;

    const displayName = (currentLang === 'fr' && product.nameFr) ? product.nameFr : product.name;
    const existingIndex = cart.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: displayName,
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

  function triggerCartBounce() {
    cartCountBadges.forEach(b => {
      b.classList.remove('cart-bounce');
      void b.offsetWidth;
      b.classList.add('cart-bounce');
    });
  }

  function updateCartUI() {
    const t = I18N[currentLang] || I18N.fr;
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCountBadges.forEach(b => b.textContent = totalCount);

    if (floatingCartTotalEl) floatingCartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${totalPrice.toFixed(2)} CAD`;
    if (cartTotalEl) cartTotalEl.textContent = `$${totalPrice.toFixed(2)} CAD`;

    if (floatingCartBtn) {
      floatingCartBtn.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">🛒</div>
          <h4 style="font-weight:700; color:#1E293B;">${t.emptyCartTitle}</h4>
          <p style="font-size:0.85rem; margin-top:0.25rem;">${t.emptyCartDesc}</p>
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
          <button class="qty-btn" type="button" onclick="window.DepanneurApp.updateQuantity('${item.id}', -1)">−</button>
          <span class="qty-count">${item.quantity}</span>
          <button class="qty-btn" type="button" onclick="window.DepanneurApp.updateQuantity('${item.id}', 1)">+</button>
        </div>
        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="cart-item-remove" type="button" title="Supprimer" onclick="window.DepanneurApp.removeFromCart('${item.id}')">✕</button>
      </div>
    `).join('');
  }

  // 11. WhatsApp Checkout Formatter
  function processWhatsAppCheckout() {
    if (cart.length === 0) return;

    const customerName = (custNameInput && custNameInput.value.trim()) || (currentLang === 'fr' ? 'Client Anonyme' : 'Customer');
    const customerPhone = (custPhoneInput && custPhoneInput.value.trim()) || 'N/A';
    const customerNote = (custNoteInput && custNoteInput.value.trim()) || 'N/A';

    let deliveryMode = currentLang === 'fr' ? 'Livraison locale (Plateau / Mile-End)' : 'Local Delivery';
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
    msg += `_Commande générée via Dépanneur Eilika WhatsApp Checkout_`;

    const waNumber = store.whatsappNumber || "15145550199";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  // 12. Drawer & Modal Controls
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

  // Fallback Data
  function getFallbackData() {
    return {
      store: {
        name: "Dépanneur Eilika",
        tagline: "Épicerie Fine & Dépanneur Officiel",
        address: "4218 Rue Saint-Denis, Plateau-Mont-Royal, Montréal, QC H2J 2K8",
        mapsUrl: "https://maps.google.com/?q=4218+Rue+Saint-Denis+Montreal",
        phone: "+1 (514) 555-0199",
        whatsappNumber: "15145550199",
        openingHour: 8,
        closingHour: 23,
        announcements: ["✨ BIENVENUE AU DÉPANNEUR EILIKA — LIVRAISON LOCALE & RAMASSAGE VIA WHATSAPP!"]
      },
      categories: [
        { id: "all", name: "All / Tous" },
        { id: "drinks", name: "Drinks / Boissons" },
        { id: "snacks", name: "Snacks & Chips" },
        { id: "smoking", name: "Lighters & Smoking" },
        { id: "health", name: "Health & Essentials" },
        { id: "general", name: "General Store" }
      ],
      products: []
    };
  }

  // Expose Global Namespace
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
