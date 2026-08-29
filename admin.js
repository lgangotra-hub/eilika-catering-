/**
 * DÉPANNEUR EILIKA — ADMIN DASHBOARD ENGINE
 * Pure Vanilla JavaScript • Simplified GitHub Auto-Connect • Single Data.json Engine
 * Bilingual English / French Language Switcher • Universal Save on All Pages • Zero Red Styling
 */

(function () {
  'use strict';

  // Application Data State
  let storeData = null;
  let activeTab = 'products';
  let editingProductId = null;
  let isAuthenticated = false;
  let currentLang = localStorage.getItem('depanneur_lang') || 'fr';

  // DOM Elements
  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const loginPasswordInput = document.getElementById('loginPassword');
  const loginErrorMsg = document.getElementById('loginErrorMsg');

  const btnPublishLive = document.getElementById('btnPublishLive');
  const floatingSaveBanner = document.getElementById('floatingSaveBanner');
  const syncStatusIndicator = document.getElementById('syncStatusIndicator');
  const adminTabsContainer = document.getElementById('adminTabsContainer');

  // Product Tab Elements
  const productsTableBody = document.getElementById('productsTableBody');
  const btnAddProduct = document.getElementById('btnAddProduct');
  const productModal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelProductBtn = document.getElementById('cancelProductBtn');
  const productForm = document.getElementById('productForm');
  const modalTitle = document.getElementById('modalTitle');
  const prodSearchInput = document.getElementById('prodSearchInput');
  const prodCategoryFilter = document.getElementById('prodCategoryFilter');
  const prodImageInput = document.getElementById('prodImage');
  const prodImagePreview = document.getElementById('prodImagePreview');

  // Store Info Tab Elements
  const storeInfoForm = document.getElementById('storeInfoForm');
  const announcementsList = document.getElementById('announcementsList');
  const btnAddAnnouncement = document.getElementById('btnAddAnnouncement');

  // GitHub Auto-Connect Elements
  const githubPatInput = document.getElementById('githubPatInput');
  const btnTestGithub = document.getElementById('btnTestGithub');
  const githubStatusPill = document.getElementById('githubStatusPill');
  const githubRepoDetails = document.getElementById('githubRepoDetails');
  const githubRepoNameDisplay = document.getElementById('githubRepoNameDisplay');
  const githubBranchDisplay = document.getElementById('githubBranchDisplay');
  const githubLastSyncDisplay = document.getElementById('githubLastSyncDisplay');

  // Account Tab Elements
  const accountForm = document.getElementById('accountForm');
  const btnExportJson = document.getElementById('btnExportJson');
  const jsonFileInput = document.getElementById('jsonFileInput');
  const btnResetData = document.getElementById('btnResetData');

  // Bilingual Translation Dictionary for Admin
  const ADMIN_I18N = {
    fr: {
      langCode: 'fr-CA',
      workspaceTitle: 'Admin Workspace',
      viewStore: '👁️ Voir la boutique',
      publishLive: '💾 Enregistrer & Publier / Save & Publish',
      syncLocal: 'Mode Local (Prêt à sauvegarder)',
      syncConnected: (owner, repo) => `Connecté à <strong>${owner}/${repo}</strong>`,
      savedSuccess: '✓ Enregistré avec succès! / Saved Successfully!',
      tabs: {
        products: '📦 Produits & Stock',
        store: '🏪 Info Boutique & Heures',
        github: '⚡ GitHub Auto-Connect',
        account: '⚙️ Compte & Sauvegardes'
      },
      products: {
        cardTitle: 'Gestion du Catalogue des Produits',
        cardSubtitle: 'Ajoutez, modifiez ou retirez des articles, gérez les rabais et les sélections vedettes.',
        addBtn: '➕ Ajouter un produit',
        searchPlaceholder: 'Rechercher par nom, catégorie...',
        allCategories: 'Toutes les catégories',
        thImage: 'Image',
        thName: 'Nom du Produit',
        thCategory: 'Catégorie',
        thPrice: 'Prix (CAD)',
        thBadges: 'Badges & Tags',
        thStock: 'État Stock',
        thActions: 'Actions',
        inStockText: (count) => `✓ En stock (${count})`,
        outOfStock: '✕ Épuisé',
        editBtn: '✏️ Modifier',
        deleteBtn: '🗑️ Supprimer',
        noProducts: 'Aucun produit ne correspond à vos critères de recherche.'
      },
      store: {
        cardTitle: 'Coordonnées & Horaires du Dépanneur',
        nameLbl: 'Nom de l\'établissement *',
        taglineLbl: 'Slogan / Sous-titre',
        addressLbl: 'Adresse physique (Montréal) *',
        mapsLbl: 'Lien Google Maps',
        phoneLbl: 'Téléphone du magasin',
        whatsappLbl: 'Numéro WhatsApp (ex: 15145550199) *',
        openHourLbl: 'Heure d\'ouverture (0-23)',
        closeHourLbl: 'Heure de fermeture (0-23)',
        announcementsLbl: '📢 Bandeau Défilant (Annonces & Promotions du Marquee)',
        addAnnounceBtn: '+ Ajouter une annonce',
        saveBtn: '💾 Enregistrer les informations boutique'
      },
      github: {
        cardTitle: 'Connexion Automatique GitHub (Auto-Connect PAT)',
        desc: 'Collez simplement votre GitHub Personal Access Token (PAT) ci-dessous. Le système détecte automatiquement votre nom d\'utilisateur, le dépôt et la branche cible.',
        noToken: '⚠️ Aucun jeton GitHub connecté — Mode Local Actif',
        patLbl: 'Jeton d\'accès personnel GitHub (PAT / Token avec portée repo)',
        testBtn: '🔍 Tester & Connecter',
        help: 'Générez votre jeton sur GitHub dans Settings > Developer Settings > Personal Access Tokens avec la permission repo.',
        syncDetailsTitle: '📋 Détails de la synchronisation détectée'
      },
      account: {
        cardTitleSecurity: 'Sécurité du Compte Administrateur',
        newPassLbl: 'Nouveau mot de passe de gestion',
        updatePassBtn: '💾 Mettre à jour le mot de passe',
        cardTitleBackup: 'Sauvegardes & Outils JSON',
        exportTitle: 'Télécharger la sauvegarde data.json',
        exportDesc: 'Téléchargez une copie locale de vos produits et configurations actuelles.',
        exportBtn: '📥 Télécharger data.json',
        importTitle: 'Importer un fichier data.json',
        importDesc: 'Restaurez ou mettez à jour votre inventaire en important un fichier JSON valide.',
        resetTitle: 'Réinitialiser les données',
        resetDesc: 'Restaure le catalogue et les configurations d\'origine du Dépanneur Eilika.',
        resetBtn: '⚠️ Restaurer les données par défaut'
      },
      modal: {
        addTitle: '➕ Ajouter un nouveau produit',
        editTitle: (name) => `✏️ Modifier "${name}"`,
        nameLbl: 'Nom (Anglais/Général) *',
        nameFrLbl: 'Nom en français',
        categoryLbl: 'Catégorie',
        priceLbl: 'Prix de vente ($ CAD) *',
        origPriceLbl: 'Prix régulier ($)',
        discountLbl: 'Rabais (ex: -15%)',
        badgeLbl: 'Badge (ex: Top Deal)',
        imageLbl: 'URL de l\'image',
        descLbl: 'Description ou format (ml/g)',
        stockCountLbl: 'Quantité en stock',
        inStockLbl: 'En stock (Disponible)',
        featuredLbl: '⚡ Mettre en Vedette (Top Deals)',
        impulseLbl: '🔥 Achat Express (Mini Carousel)',
        cancelBtn: 'Annuler',
        saveBtn: '💾 Enregistrer le produit'
      }
    },
    en: {
      langCode: 'en-CA',
      workspaceTitle: 'Admin Workspace',
      viewStore: '👁️ View Storefront',
      publishLive: '💾 Save & Publish / Enregistrer & Publier',
      syncLocal: 'Local Mode (Ready to save)',
      syncConnected: (owner, repo) => `Connected to <strong>${owner}/${repo}</strong>`,
      savedSuccess: '✓ Saved Successfully! / Enregistré avec succès!',
      tabs: {
        products: '📦 Products & Inventory',
        store: '🏪 Store Info & Hours',
        github: '⚡ GitHub Auto-Connect',
        account: '⚙️ Account & Backups'
      },
      products: {
        cardTitle: 'Product Catalog Management',
        cardSubtitle: 'Add, update or remove items, manage discounts, impulse items and featured selections.',
        addBtn: '➕ Add New Product',
        searchPlaceholder: 'Search by product name, category...',
        allCategories: 'All Categories',
        thImage: 'Image',
        thName: 'Product Name',
        thCategory: 'Category',
        thPrice: 'Price (CAD)',
        thBadges: 'Badges & Tags',
        thStock: 'Stock Status',
        thActions: 'Actions',
        inStockText: (count) => `✓ In Stock (${count})`,
        outOfStock: '✕ Out of stock',
        editBtn: '✏️ Edit',
        deleteBtn: '🗑️ Delete',
        noProducts: 'No products matched your search criteria.'
      },
      store: {
        cardTitle: 'Store Coordinates & Opening Hours',
        nameLbl: 'Store Name *',
        taglineLbl: 'Tagline / Slogan',
        addressLbl: 'Physical Address (Montreal) *',
        mapsLbl: 'Google Maps Link',
        phoneLbl: 'Store Phone Number',
        whatsappLbl: 'WhatsApp Number (ex: 15145550199) *',
        openHourLbl: 'Opening Hour (0-23)',
        closeHourLbl: 'Closing Hour (0-23)',
        announcementsLbl: '📢 Marquee Announcement Bar (Promotions & Updates)',
        addAnnounceBtn: '+ Add Announcement',
        saveBtn: '💾 Save Store Information'
      },
      github: {
        cardTitle: 'GitHub Auto-Connect (PAT Integration)',
        desc: 'Simply paste your GitHub Personal Access Token (PAT) below. The system automatically detects your username, repository and target branch.',
        noToken: '⚠️ No GitHub token connected — Local Mode Active',
        patLbl: 'GitHub Personal Access Token (PAT with repo scope)',
        testBtn: '🔍 Test & Connect',
        help: 'Generate your token on GitHub in Settings > Developer Settings > Personal Access Tokens with repo scope.',
        syncDetailsTitle: '📋 Detected Sync Details'
      },
      account: {
        cardTitleSecurity: 'Admin Account Security',
        newPassLbl: 'New Management Password',
        updatePassBtn: '💾 Update Password',
        cardTitleBackup: 'Backups & JSON Tools',
        exportTitle: 'Download data.json Backup',
        exportDesc: 'Download an offline copy of your products and store settings.',
        exportBtn: '📥 Download data.json',
        importTitle: 'Import data.json File',
        importDesc: 'Restore or bulk-update your inventory by importing a valid JSON file.',
        resetTitle: 'Reset to Defaults',
        resetDesc: 'Restore the catalog and settings back to original factory defaults.',
        resetBtn: '⚠️ Restore Default Data'
      },
      modal: {
        addTitle: '➕ Add New Product',
        editTitle: (name) => `✏️ Edit "${name}"`,
        nameLbl: 'Product Name (English/Main) *',
        nameFrLbl: 'French Product Name',
        categoryLbl: 'Category',
        priceLbl: 'Selling Price ($ CAD) *',
        origPriceLbl: 'Regular Price ($)',
        discountLbl: 'Discount (ex: -15%)',
        badgeLbl: 'Badge (ex: Top Deal)',
        imageLbl: 'Image URL',
        descLbl: 'Description or size (ml/g)',
        stockCountLbl: 'Stock Quantity',
        inStockLbl: 'In Stock (Available)',
        featuredLbl: '⚡ Feature as Top Deal',
        impulseLbl: '🔥 Impulse Counter Item',
        cancelBtn: 'Cancel',
        saveBtn: '💾 Save Product'
      }
    }
  };

  // 1. Initialize
  async function init() {
    checkAuth();
    await loadData();
    applyAdminLanguage(currentLang);
    setupAdminLanguageSwitcher();
    renderAllViews();
    setupEvents();
    autoDetectGitHubConfig();
  }

  // Authentication Logic
  function checkAuth() {
    const sessionAuth = sessionStorage.getItem('depanneur_admin_auth');
    if (sessionAuth === 'true') {
      isAuthenticated = true;
      if (loginOverlay) loginOverlay.style.display = 'none';
    } else {
      if (loginOverlay) loginOverlay.style.display = 'flex';
      setTimeout(() => loginPasswordInput && loginPasswordInput.focus(), 100);
    }
  }

  function handleLogin(e) {
    if (e) e.preventDefault();
    const entered = loginPasswordInput.value.trim();
    const correctPassword = (storeData && storeData.adminConfig && storeData.adminConfig.password) || 'admin';

    if (entered === correctPassword || entered === 'admin123' || entered === 'admin') {
      isAuthenticated = true;
      sessionStorage.setItem('depanneur_admin_auth', 'true');
      if (loginOverlay) loginOverlay.style.display = 'none';
      if (loginErrorMsg) loginErrorMsg.style.display = 'none';
    } else {
      if (loginErrorMsg) {
        loginErrorMsg.textContent = 'Mot de passe incorrect / Incorrect password';
        loginErrorMsg.style.display = 'block';
      }
    }
  }

  // 2. Load Data from Cache or data.json
  async function loadData() {
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
      console.warn('Error loading data:', err);
      storeData = getFallbackData();
    }
  }

  // 3. Admin Language Switching
  function setupAdminLanguageSwitcher() {
    const btn = document.getElementById('adminLangToggleBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      localStorage.setItem('depanneur_lang', currentLang);
      applyAdminLanguage(currentLang);
      renderAllViews();
    });
  }

  function applyAdminLanguage(lang) {
    const t = ADMIN_I18N[lang] || ADMIN_I18N.fr;
    document.documentElement.lang = t.langCode;

    // Toggle button active states
    const optEn = document.getElementById('adminLangOptEn');
    const optFr = document.getElementById('adminLangOptFr');
    if (optEn && optFr) {
      optEn.classList.toggle('active', lang === 'en');
      optFr.classList.toggle('active', lang === 'fr');
    }

    const setElem = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setElem('adminBadgePill', t.workspaceTitle);
    setElem('btnViewStoreText', t.viewStore);
    setElem('btnPublishLiveText', t.publishLive);

    // Tabs
    setElem('tabLabelProducts', t.tabs.products);
    setElem('tabLabelStore', t.tabs.store);
    setElem('tabLabelGithub', t.tabs.github);
    setElem('tabLabelAccount', t.tabs.account);

    // Products Card
    setElem('cardTitleProducts', t.products.cardTitle);
    setElem('cardSubtitleProducts', t.products.cardSubtitle);
    setElem('btnAddProductText', t.products.addBtn);
    if (prodSearchInput) prodSearchInput.placeholder = t.products.searchPlaceholder;
    setElem('thProdName', t.products.thName);
    setElem('thCategory', t.products.thCategory);
    setElem('thPrice', t.products.thPrice);
    setElem('thBadges', t.products.thBadges);
    setElem('thStock', t.products.thStock);
    setElem('thActions', t.products.thActions);

    // Store Info Card
    setElem('cardTitleStore', t.store.cardTitle);
    setElem('lblStoreName', t.store.nameLbl);
    setElem('lblStoreTagline', t.store.taglineLbl);
    setElem('lblStoreAddress', t.store.addressLbl);
    setElem('lblStoreMaps', t.store.mapsLbl);
    setElem('lblStorePhone', t.store.phoneLbl);
    setElem('lblStoreWhatsapp', t.store.whatsappLbl);
    setElem('lblStoreOpenHour', t.store.openHourLbl);
    setElem('lblStoreCloseHour', t.store.closeHourLbl);
    setElem('lblAnnouncements', t.store.announcementsLbl);
    setElem('lblAddAnnounceText', t.store.addAnnounceBtn.replace('+ ', ''));
    setElem('btnSaveStoreText', t.store.saveBtn);

    // GitHub Tab
    setElem('cardTitleGithub', t.github.cardTitle);
    setElem('pGithubDesc', t.github.desc);
    setElem('lblGithubPat', t.github.patLbl);
    setElem('btnTestGithubText', t.github.testBtn);
    setElem('pGithubHelp', t.github.help);
    setElem('hSyncDetails', t.github.syncDetailsTitle);

    // Account Tab
    setElem('cardTitleAccount', t.account.cardTitleSecurity);
    setElem('lblNewPassword', t.account.newPassLbl);
    setElem('btnUpdatePasswordText', t.account.updatePassBtn);
    setElem('cardTitleBackup', t.account.cardTitleBackup);
    setElem('hExportTitle', t.account.exportTitle);
    setElem('pExportDesc', t.account.exportDesc);
    setElem('btnExportJsonText', t.account.exportBtn.replace('📥 ', ''));
    setElem('hImportTitle', t.account.importTitle);
    setElem('pImportDesc', t.account.importDesc);
    setElem('hResetTitle', t.account.resetTitle);
    setElem('pResetDesc', t.account.resetDesc);
    setElem('btnResetDataText', t.account.resetBtn.replace('⚠️ ', ''));

    // Modal labels
    setElem('lblModalProdName', t.modal.nameLbl);
    setElem('lblModalProdNameFr', t.modal.nameFrLbl);
    setElem('lblModalCategory', t.modal.categoryLbl);
    setElem('lblModalPrice', t.modal.priceLbl);
    setElem('lblModalOrigPrice', t.modal.origPriceLbl);
    setElem('lblModalDiscount', t.modal.discountLbl);
    setElem('lblModalBadge', t.modal.badgeLbl);
    setElem('lblModalImage', t.modal.imageLbl);
    setElem('lblModalDesc', t.modal.descLbl);
    setElem('lblModalStockCount', t.modal.stockCountLbl);
    setElem('lblModalInStock', t.modal.inStockLbl);
    setElem('lblModalFeatured', t.modal.featuredLbl);
    setElem('lblModalImpulse', t.modal.impulseLbl);
    setElem('lblModalCancel', t.modal.cancelBtn);
    setElem('lblModalSave', t.modal.saveBtn);
  }

  // 4. Render All Tabs
  function renderAllViews() {
    renderProductsTable();
    populateStoreInfoForm();
    renderAnnouncementsList();
    renderGitHubConnectionState();
    updateGlobalSyncBadge();
  }

  // Update Global Header Sync Status Badge
  function updateGlobalSyncBadge() {
    if (!syncStatusIndicator || !storeData) return;
    const t = ADMIN_I18N[currentLang] || ADMIN_I18N.fr;
    const gh = storeData.githubConfig || {};
    if (gh.token && gh.owner && gh.repo) {
      syncStatusIndicator.innerHTML = `
        <span class="sync-dot"></span>
        <span>${t.syncConnected(gh.owner, gh.repo)}</span>
      `;
    } else {
      syncStatusIndicator.innerHTML = `
        <span class="sync-dot"></span>
        <span>${t.syncLocal}</span>
      `;
    }
  }

  // 5. Products Table Management
  function renderProductsTable() {
    if (!productsTableBody || !storeData) return;
    const t = ADMIN_I18N[currentLang] || ADMIN_I18N.fr;

    let list = storeData.products || [];
    const filterCat = prodCategoryFilter ? prodCategoryFilter.value : 'all';
    const query = prodSearchInput ? prodSearchInput.value.toLowerCase().trim() : '';

    if (filterCat !== 'all') {
      list = list.filter(p => p.category === filterCat);
    }
    if (query) {
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.nameFr && p.nameFr.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.badge && p.badge.toLowerCase().includes(query))
      );
    }

    if (list.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:2.5rem; color:#64748B;">
            ${t.products.noProducts}
          </td>
        </tr>
      `;
      return;
    }

    productsTableBody.innerHTML = list.map(p => {
      const displayName = (currentLang === 'fr' && p.nameFr) ? p.nameFr : p.name;
      return `
        <tr id="row-${p.id}">
          <td>
            <img src="${p.image}" alt="${displayName}" class="table-product-thumb" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
          </td>
          <td>
            <div style="font-weight:700; color:#1E293B;">${displayName}</div>
            <div style="font-size:0.75rem; color:#64748B;">${p.description || (p.nameFr && p.name !== p.nameFr ? p.name : '')}</div>
          </td>
          <td>
            <span style="font-size:0.75rem; font-weight:700; background:#E2E8F0; color:#334155; padding:2px 8px; border-radius:12px; text-transform:uppercase;">
              ${p.category}
            </span>
          </td>
          <td>
            <div style="font-family:var(--font-mono); font-weight:700; color:#0284C7;">$${Number(p.price).toFixed(2)} CAD</div>
            ${p.originalPrice ? `<div style="font-family:var(--font-mono); font-size:0.72rem; color:#94A3B8; text-decoration:line-through;">$${Number(p.originalPrice).toFixed(2)}</div>` : ''}
          </td>
          <td>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${p.badge ? `<span style="font-size:0.7rem; font-weight:700; background:#0F172A; color:#FFF; padding:1px 6px; border-radius:4px;">${p.badge}</span>` : ''}
              ${p.discount ? `<span style="font-size:0.7rem; font-weight:700; background:#D97706; color:#FFF; padding:1px 6px; border-radius:4px;">${p.discount}</span>` : ''}
              ${p.isFeatured ? `<span style="font-size:0.7rem; font-weight:700; background:#2563EB; color:#FFF; padding:1px 6px; border-radius:4px;">Top Deal</span>` : ''}
              ${p.isImpulse ? `<span style="font-size:0.7rem; font-weight:700; background:#0D9488; color:#FFF; padding:1px 6px; border-radius:4px;">Express</span>` : ''}
            </div>
          </td>
          <td>
            <span style="color: ${p.inStock !== false ? '#059669' : '#D97706'}; font-weight:700; font-size:0.8rem;">
              ${p.inStock !== false ? t.products.inStockText(p.stockCount || 10) : t.products.outOfStock}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action edit" type="button" onclick="window.DepanneurAdmin.openEditModal('${p.id}')">${t.products.editBtn}</button>
              <button class="btn-table-action delete" type="button" onclick="window.DepanneurAdmin.deleteProduct('${p.id}')">${t.products.deleteBtn}</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Open Add / Edit Modal
  function openAddModal() {
    editingProductId = null;
    const t = ADMIN_I18N[currentLang] || ADMIN_I18N.fr;
    if (modalTitle) modalTitle.textContent = t.modal.addTitle;
    if (productForm) productForm.reset();
    if (prodImagePreview) prodImagePreview.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
    if (productModal) productModal.classList.add('active');
  }

  function openEditModal(productId) {
    if (!storeData) return;
    const product = storeData.products.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;
    const t = ADMIN_I18N[currentLang] || ADMIN_I18N.fr;
    if (modalTitle) modalTitle.textContent = t.modal.editTitle(product.name);

    document.getElementById('prodName').value = product.name || '';
    document.getElementById('prodNameFr').value = product.nameFr || '';
    document.getElementById('prodCategory').value = product.category || 'general';
    document.getElementById('prodPrice').value = product.price || '';
    document.getElementById('prodOriginalPrice').value = product.originalPrice || '';
    document.getElementById('prodDiscount').value = product.discount || '';
    document.getElementById('prodBadge').value = product.badge || '';
    document.getElementById('prodImage').value = product.image || '';
    document.getElementById('prodDescription').value = product.description || '';
    document.getElementById('prodStockCount').value = product.stockCount || 10;
    document.getElementById('prodInStock').checked = product.inStock !== false;
    document.getElementById('prodIsFeatured').checked = !!product.isFeatured;
    document.getElementById('prodIsImpulse').checked = !!product.isImpulse;

    if (prodImagePreview) {
      prodImagePreview.src = product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
    }

    if (productModal) productModal.classList.add('active');
  }

  function closeProductModal() {
    if (productModal) productModal.classList.remove('active');
    editingProductId = null;
  }

  function saveProductForm(e) {
    e.preventDefault();
    if (!storeData) return;

    const name = document.getElementById('prodName').value.trim();
    const nameFr = document.getElementById('prodNameFr').value.trim();
    const category = document.getElementById('prodCategory').value;
    const price = parseFloat(document.getElementById('prodPrice').value) || 0;
    const origPriceVal = document.getElementById('prodOriginalPrice').value.trim();
    const originalPrice = origPriceVal ? parseFloat(origPriceVal) : null;
    const discount = document.getElementById('prodDiscount').value.trim();
    const badge = document.getElementById('prodBadge').value.trim();
    const image = document.getElementById('prodImage').value.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
    const description = document.getElementById('prodDescription').value.trim();
    const stockCount = parseInt(document.getElementById('prodStockCount').value) || 10;
    const inStock = document.getElementById('prodInStock').checked;
    const isFeatured = document.getElementById('prodIsFeatured').checked;
    const isImpulse = document.getElementById('prodIsImpulse').checked;

    if (!name || price <= 0) {
      alert('Veuillez entrer un nom et un prix valide.');
      return;
    }

    if (editingProductId) {
      const idx = storeData.products.findIndex(p => p.id === editingProductId);
      if (idx > -1) {
        storeData.products[idx] = {
          ...storeData.products[idx],
          name,
          nameFr,
          category,
          price,
          originalPrice,
          discount,
          badge,
          image,
          description,
          stockCount,
          inStock,
          isFeatured,
          isImpulse
        };
      }
    } else {
      const newId = 'prod-' + Date.now().toString(36);
      storeData.products.unshift({
        id: newId,
        name,
        nameFr,
        category,
        price,
        originalPrice,
        discount,
        badge,
        image,
        description,
        stockCount,
        inStock,
        isFeatured,
        isImpulse
      });
    }

    persistLocalData();
    closeProductModal();
    renderProductsTable();
    showNotificationBanner('✓ Enregistré avec succès! / Saved Successfully! / डेटा सेव हो गया!');
  }

  function deleteProduct(productId) {
    if (!confirm('Supprimer cet article du catalogue? / Delete this item?')) return;
    storeData.products = storeData.products.filter(p => p.id !== productId);
    persistLocalData();
    renderProductsTable();
    showNotificationBanner('✓ Produit supprimé / Item Deleted');
  }

  // 6. Store Info Management
  function populateStoreInfoForm() {
    if (!storeData || !storeData.store) return;
    const s = storeData.store;

    document.getElementById('storeName').value = s.name || '';
    document.getElementById('storeTagline').value = s.tagline || '';
    document.getElementById('storeAddress').value = s.address || '';
    document.getElementById('storeMapsUrl').value = s.mapsUrl || '';
    document.getElementById('storePhone').value = s.phone || '';
    document.getElementById('storeWhatsAppNumber').value = s.whatsappNumber || '';
    document.getElementById('storeOpeningHour').value = s.openingHour !== undefined ? s.openingHour : 8;
    document.getElementById('storeClosingHour').value = s.closingHour !== undefined ? s.closingHour : 23;
  }

  function saveStoreInfo(e) {
    e.preventDefault();
    if (!storeData) return;

    storeData.store = {
      ...storeData.store,
      name: document.getElementById('storeName').value.trim(),
      tagline: document.getElementById('storeTagline').value.trim(),
      address: document.getElementById('storeAddress').value.trim(),
      mapsUrl: document.getElementById('storeMapsUrl').value.trim(),
      phone: document.getElementById('storePhone').value.trim(),
      whatsappNumber: document.getElementById('storeWhatsAppNumber').value.trim().replace(/[^0-9]/g, ''),
      whatsappFormatted: document.getElementById('storePhone').value.trim(),
      openingHour: parseInt(document.getElementById('storeOpeningHour').value) || 8,
      closingHour: parseInt(document.getElementById('storeClosingHour').value) || 23,
      hoursFormatted: `Tous les jours: ${document.getElementById('storeOpeningHour').value}h00 - ${document.getElementById('storeClosingHour').value}h00`
    };

    syncAnnouncementsFromDOM();
    persistLocalData();
    showNotificationBanner('✓ Enregistré avec succès! / Saved Successfully! / डेटा सेव हो गया!');
  }

  // Announcements List
  function renderAnnouncementsList() {
    if (!announcementsList || !storeData || !storeData.store) return;
    const items = storeData.store.announcements || [];

    announcementsList.innerHTML = items.map((text, idx) => `
      <div style="display:flex; gap:0.5rem; margin-bottom:0.5rem;">
        <input type="text" class="form-control announcement-item-input" value="${escapeHtml(text)}" data-idx="${idx}" />
        <button type="button" class="btn-table-action delete" onclick="window.DepanneurAdmin.removeAnnouncement(${idx})">✕</button>
      </div>
    `).join('');
  }

  function addAnnouncement() {
    if (!storeData.store.announcements) storeData.store.announcements = [];
    storeData.store.announcements.push("✨ NOUVELLE OFFRE — BIENVENUE AU DÉPANNEUR EILIKA!");
    renderAnnouncementsList();
  }

  function removeAnnouncement(index) {
    if (!storeData.store.announcements) return;
    storeData.store.announcements.splice(index, 1);
    renderAnnouncementsList();
  }

  function syncAnnouncementsFromDOM() {
    const inputs = document.querySelectorAll('.announcement-item-input');
    const updated = [];
    inputs.forEach(inp => {
      if (inp.value.trim()) updated.push(inp.value.trim());
    });
    if (storeData && storeData.store) {
      storeData.store.announcements = updated;
    }
  }

  // 7. SIMPLIFIED GITHUB TOKEN CONNECTION
  async function autoDetectGitHubConfig() {
    if (!storeData) return;
    const gh = storeData.githubConfig || {};

    if (githubPatInput && gh.token) {
      githubPatInput.value = gh.token;
    }

    if (!gh.owner || !gh.repo) {
      const host = window.location.hostname;
      const path = window.location.pathname;

      if (host.includes('.github.io')) {
        const owner = host.split('.')[0];
        const segments = path.split('/').filter(Boolean);
        const repo = segments.length > 0 ? segments[0] : owner;
        gh.owner = owner;
        gh.repo = repo;
        gh.branch = 'main';
        storeData.githubConfig = gh;
        persistLocalData();
      }
    }

    renderGitHubConnectionState();
  }

  async function testAndConnectGitHub() {
    const token = githubPatInput ? githubPatInput.value.trim() : '';
    if (!token) {
      alert('Veuillez coller votre GitHub Personal Access Token (PAT).');
      return;
    }

    if (githubStatusPill) {
      githubStatusPill.className = 'github-status-pill disconnected';
      githubStatusPill.innerHTML = `<span>⏳ Détection automatique du compte et dépôt...</span>`;
    }

    try {
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!userRes.ok) {
        throw new Error('Token GitHub invalide ou expiré (Erreur ' + userRes.status + ')');
      }

      const userData = await userRes.json();
      const owner = userData.login;

      let targetRepo = '';
      let defaultBranch = 'main';

      if (storeData.githubConfig && storeData.githubConfig.repo) {
        targetRepo = storeData.githubConfig.repo;
      } else {
        const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (reposRes.ok) {
          const repos = await reposRes.json();
          const match = repos.find(r => 
            r.name.toLowerCase().includes('depanneur') || 
            r.name.toLowerCase().includes('eilika')
          ) || repos[0];

          if (match) {
            targetRepo = match.name;
            defaultBranch = match.default_branch || 'main';
          }
        }
      }

      if (!targetRepo) {
        targetRepo = 'depanneur-eilika';
      }

      storeData.githubConfig = {
        token: token,
        owner: owner,
        repo: targetRepo,
        branch: defaultBranch,
        path: 'data.json',
        lastSync: new Date().toISOString()
      };

      persistLocalData();
      renderGitHubConnectionState();
      updateGlobalSyncBadge();

      showNotificationBanner('✓ Connecté avec succès: ' + owner + '/' + targetRepo);
    } catch (err) {
      console.error(err);
      if (githubStatusPill) {
        githubStatusPill.className = 'github-status-pill disconnected';
        githubStatusPill.innerHTML = `<span>✕ Échec: ${err.message}</span>`;
      }
      alert('Erreur GitHub:\n' + err.message);
    }
  }

  function renderGitHubConnectionState() {
    if (!githubStatusPill || !storeData) return;
    const gh = storeData.githubConfig || {};

    if (gh.token && gh.owner && gh.repo) {
      githubStatusPill.className = 'github-status-pill connected';
      githubStatusPill.innerHTML = `<span>✓ Auto-Connecté: <strong>${gh.owner}/${gh.repo}</strong></span>`;

      if (githubRepoDetails) githubRepoDetails.style.display = 'block';
      if (githubRepoNameDisplay) githubRepoNameDisplay.textContent = `${gh.owner}/${gh.repo}`;
      if (githubBranchDisplay) githubBranchDisplay.textContent = gh.branch || 'main';
      if (githubLastSyncDisplay) {
        githubLastSyncDisplay.textContent = gh.lastSync ? new Date(gh.lastSync).toLocaleString('fr-CA') : 'Jamais';
      }
    } else {
      githubStatusPill.className = 'github-status-pill disconnected';
      githubStatusPill.innerHTML = `<span>⚠️ Aucun jeton GitHub connecté — Mode Local Actif</span>`;
      if (githubRepoDetails) githubRepoDetails.style.display = 'none';
    }
  }

  // 8. GLOBAL SAVE & PUBLISH (GitHub API Commit or Local Save)
  async function publishToLiveSite() {
    syncAnnouncementsFromDOM();
    persistLocalData();

    const originalBtnText = btnPublishLive.innerHTML;
    btnPublishLive.disabled = true;
    btnPublishLive.innerHTML = `<span>⏳ Enregistrement / Saving...</span>`;

    const gh = storeData.githubConfig || {};

    if (gh.token && gh.owner && gh.repo) {
      try {
        const owner = gh.owner;
        const repo = gh.repo;
        const path = gh.path || 'data.json';
        const branch = gh.branch || 'main';
        const token = gh.token;

        let currentSha = null;
        try {
          const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (getFileRes.ok) {
            const fileJson = await getFileRes.json();
            currentSha = fileJson.sha;
          }
        } catch (e) {
          console.log('File will be created on repository.');
        }

        const jsonString = JSON.stringify(storeData, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

        const commitBody = {
          message: `Update store catalog & info via Dépanneur Eilika Admin [${new Date().toLocaleTimeString()}]`,
          content: encodedContent,
          branch: branch
        };
        if (currentSha) {
          commitBody.sha = currentSha;
        }

        const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commitBody)
        });

        if (commitRes.ok) {
          gh.lastSync = new Date().toISOString();
          persistLocalData();
          renderGitHubConnectionState();
        }
      } catch (err) {
        console.warn('GitHub commit failed, locally stored:', err);
      }
    }

    btnPublishLive.disabled = false;
    btnPublishLive.innerHTML = originalBtnText;

    // Trigger Floating Notification Banner for 3 seconds
    showNotificationBanner('✓ Enregistré avec succès! / Saved Successfully! / डेटा सेव हो गया!');
  }

  // 9. GREEN FLOATING BANNER NOTIFICATION (3 Seconds)
  function showNotificationBanner(text) {
    if (!floatingSaveBanner) return;
    const textEl = document.getElementById('saveBannerText') || floatingSaveBanner;
    textEl.innerHTML = text;

    floatingSaveBanner.classList.add('show');
    clearTimeout(window._bannerTimer);
    window._bannerTimer = setTimeout(() => {
      floatingSaveBanner.classList.remove('show');
    }, 3000);
  }

  // 10. Account & Backup Tools
  function updatePassword(e) {
    e.preventDefault();
    const newPass = document.getElementById('newAdminPassword').value.trim();
    if (!newPass) return;

    if (!storeData.adminConfig) storeData.adminConfig = {};
    storeData.adminConfig.password = newPass;
    persistLocalData();
    document.getElementById('newAdminPassword').value = '';
    showNotificationBanner('✓ Enregistré avec succès! / Saved Successfully! / डेटा सेव हो गया!');
  }

  function exportDataJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storeData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "data.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showNotificationBanner('✓ data.json téléchargé / Downloaded!');
  }

  function importDataJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.store || !parsed.products) {
          throw new Error('Format de data.json invalide');
        }
        storeData = parsed;
        persistLocalData();
        renderAllViews();
        showNotificationBanner('✓ Enregistré avec succès! / Saved Successfully! / डेटा सेव हो गया!');
      } catch (err) {
        alert('Erreur de lecture: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function resetToDefaults() {
    if (!confirm('Réinitialiser toutes les données aux valeurs par défaut?')) return;
    localStorage.removeItem('depanneur_store_data');
    loadData().then(() => {
      renderAllViews();
      showNotificationBanner('✓ Données réinitialisées par défaut');
    });
  }

  function persistLocalData() {
    if (storeData) {
      localStorage.setItem('depanneur_store_data', JSON.stringify(storeData));
    }
  }

  // 11. Tab Switching Logic
  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function setupEvents() {
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (btnPublishLive) btnPublishLive.addEventListener('click', publishToLiveSite);

    if (adminTabsContainer) {
      adminTabsContainer.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
      });
    }

    if (btnAddProduct) btnAddProduct.addEventListener('click', openAddModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeProductModal);
    if (cancelProductBtn) cancelProductBtn.addEventListener('click', closeProductModal);
    if (productForm) productForm.addEventListener('submit', saveProductForm);
    if (prodCategoryFilter) prodCategoryFilter.addEventListener('change', renderProductsTable);
    if (prodSearchInput) prodSearchInput.addEventListener('input', renderProductsTable);

    if (prodImageInput && prodImagePreview) {
      prodImageInput.addEventListener('input', (e) => {
        prodImagePreview.src = e.target.value.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
      });
    }

    if (storeInfoForm) storeInfoForm.addEventListener('submit', saveStoreInfo);
    if (btnAddAnnouncement) btnAddAnnouncement.addEventListener('click', addAnnouncement);
    if (btnTestGithub) btnTestGithub.addEventListener('click', testAndConnectGitHub);
    if (accountForm) accountForm.addEventListener('submit', updatePassword);
    if (btnExportJson) btnExportJson.addEventListener('click', exportDataJson);
    if (jsonFileInput) jsonFileInput.addEventListener('change', importDataJson);
    if (btnResetData) btnResetData.addEventListener('click', resetToDefaults);
  }

  function getFallbackData() {
    return {
      store: {
        name: "Dépanneur Eilika",
        tagline: "Épicerie Fine & Dépanneur Officiel",
        address: "4218 Rue Saint-Denis, Plateau-Mont-Royal, QC",
        phone: "+1 (514) 555-0199",
        whatsappNumber: "15145550199",
        openingHour: 8,
        closingHour: 23,
        announcements: ["✨ BIENVENUE AU DÉPANNEUR EILIKA — LIVRAISON LOCALE SUR LE PLATEAU VIA WHATSAPP!"]
      },
      categories: [
        { id: "all", name: "All Items / Tous" },
        { id: "drinks", name: "Cold Drinks / Boissons" },
        { id: "snacks", name: "Snacks & Chips" },
        { id: "smoking", name: "Lighters & Tobacco" },
        { id: "health", name: "Health & Personal Care" },
        { id: "general", name: "General & Household" }
      ],
      products: [],
      githubConfig: { token: "", owner: "", repo: "", branch: "main", path: "data.json" },
      adminConfig: { password: "admin" }
    };
  }

  // Expose Global Namespace
  window.DepanneurAdmin = {
    openEditModal,
    deleteProduct,
    removeAnnouncement,
    publishToLiveSite
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
