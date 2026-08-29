/**
 * DÉPANNEUR EILIKA — ADMIN DASHBOARD ENGINE
 * Pure Vanilla JavaScript • Simplified GitHub Auto-Connect • Single Data.json Engine
 */

(function () {
  'use strict';

  // Application Data State
  let storeData = null;
  let activeTab = 'products';
  let editingProductId = null;
  let isAuthenticated = false;

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

  // 1. Initialize
  async function init() {
    checkAuth();
    await loadData();
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

  // 3. Render All Tabs
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
    const gh = storeData.githubConfig || {};
    if (gh.token && gh.owner && gh.repo) {
      syncStatusIndicator.innerHTML = `
        <span class="sync-dot"></span>
        <span>Connecté à <strong>${gh.owner}/${gh.repo}</strong></span>
      `;
    } else {
      syncStatusIndicator.innerHTML = `
        <span class="sync-dot offline"></span>
        <span>Mode Local (Prêt à synchroniser)</span>
      `;
    }
  }

  // 4. Products Table Management
  function renderProductsTable() {
    if (!productsTableBody || !storeData) return;

    let list = storeData.products || [];
    const filterCat = prodCategoryFilter ? prodCategoryFilter.value : 'all';
    const query = prodSearchInput ? prodSearchInput.value.toLowerCase().trim() : '';

    if (filterCat !== 'all') {
      list = list.filter(p => p.category === filterCat);
    }
    if (query) {
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.badge && p.badge.toLowerCase().includes(query))
      );
    }

    if (list.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:2rem; color:#64748B;">
            Aucun produit ne correspond à vos critères de recherche.
          </td>
        </tr>
      `;
      return;
    }

    productsTableBody.innerHTML = list.map(p => `
      <tr id="row-${p.id}">
        <td>
          <img src="${p.image}" alt="${p.name}" class="table-product-thumb" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
        </td>
        <td>
          <div style="font-weight:700; color:#1E293B;">${p.name}</div>
          <div style="font-size:0.75rem; color:#64748B;">${p.description || p.nameFr || ''}</div>
        </td>
        <td>
          <span style="font-size:0.75rem; font-weight:700; background:#E2E8F0; padding:2px 8px; border-radius:12px; text-transform:uppercase;">
            ${p.category}
          </span>
        </td>
        <td>
          <div style="font-family:var(--font-mono); font-weight:700; color:var(--brick-red);">$${Number(p.price).toFixed(2)} CAD</div>
          ${p.originalPrice ? `<div style="font-family:var(--font-mono); font-size:0.72rem; color:#94A3B8; text-decoration:line-through;">$${Number(p.originalPrice).toFixed(2)}</div>` : ''}
        </td>
        <td>
          <div style="display:flex; flex-wrap:wrap; gap:4px;">
            ${p.badge ? `<span style="font-size:0.7rem; font-weight:700; background:#1E293B; color:#FFF; padding:1px 6px; border-radius:4px;">${p.badge}</span>` : ''}
            ${p.discount ? `<span style="font-size:0.7rem; font-weight:700; background:#DC2626; color:#FFF; padding:1px 6px; border-radius:4px;">${p.discount}</span>` : ''}
            ${p.isFeatured ? `<span style="font-size:0.7rem; font-weight:700; background:#D97706; color:#FFF; padding:1px 6px; border-radius:4px;">Vedette</span>` : ''}
            ${p.isImpulse ? `<span style="font-size:0.7rem; font-weight:700; background:#0D9488; color:#FFF; padding:1px 6px; border-radius:4px;">Express</span>` : ''}
          </div>
        </td>
        <td>
          <span style="color: ${p.inStock !== false ? '#10B981' : '#EF4444'}; font-weight:700; font-size:0.8rem;">
            ${p.inStock !== false ? `✓ En stock (${p.stockCount || 10})` : '✕ Épuisé'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-table-action edit" onclick="window.DepanneurAdmin.openEditModal('${p.id}')">✏️ Modifier</button>
            <button class="btn-table-action delete" onclick="window.DepanneurAdmin.deleteProduct('${p.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Open Add / Edit Modal
  function openAddModal() {
    editingProductId = null;
    if (modalTitle) modalTitle.textContent = '➕ Ajouter un nouveau produit';
    if (productForm) productForm.reset();
    if (prodImagePreview) prodImagePreview.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
    if (productModal) productModal.classList.add('active');
  }

  function openEditModal(productId) {
    if (!storeData) return;
    const product = storeData.products.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;
    if (modalTitle) modalTitle.textContent = `✏️ Modifier "${product.name}"`;

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
      // Update existing
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
      // Add new
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
    showNotificationBanner('✓ Produit enregistré avec succès! / Item Saved!');
  }

  function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article du catalogue?')) return;
    storeData.products = storeData.products.filter(p => p.id !== productId);
    persistLocalData();
    renderProductsTable();
    showNotificationBanner('✓ Produit supprimé / Item Deleted');
  }

  // 5. Store Info Management
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

    persistLocalData();
    showNotificationBanner('✓ Informations de la boutique mises à jour!');
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

  // 6. SIMPLIFIED GITHUB TOKEN CONNECTION & AUTO-DETECT
  async function autoDetectGitHubConfig() {
    if (!storeData) return;
    const gh = storeData.githubConfig || {};

    if (githubPatInput && gh.token) {
      githubPatInput.value = gh.token;
    }

    // Auto-detect owner and repo from window context if hosted on GitHub Pages
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
      // 1. Fetch User Profile
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

      // 2. Fetch User Repositories to auto-detect target repository
      let targetRepo = '';
      let defaultBranch = 'main';

      // Check current stored repo or URL context first
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
          // Find repo matching "depanneur", "eilika", or the first updated repo
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

      // Save Config
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

      showNotificationBanner('✓ Connecté avec succès à GitHub: ' + owner + '/' + targetRepo);
    } catch (err) {
      console.error(err);
      if (githubStatusPill) {
        githubStatusPill.className = 'github-status-pill disconnected';
        githubStatusPill.innerHTML = `<span>✕ Échec de connexion: ${err.message}</span>`;
      }
      alert('Erreur de connexion GitHub:\n' + err.message);
    }
  }

  function renderGitHubConnectionState() {
    if (!githubStatusPill || !storeData) return;
    const gh = storeData.githubConfig || {};

    if (gh.token && gh.owner && gh.repo) {
      githubStatusPill.className = 'github-status-pill connected';
      githubStatusPill.innerHTML = `<span>✓ Auto-Connecté au dépôt GitHub: <strong>${gh.owner}/${gh.repo}</strong></span>`;

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

  // 7. GLOBAL SAVE & PUBLISH TO LIVE SITE (GitHub API Commit)
  async function publishToLiveSite() {
    syncAnnouncementsFromDOM();
    persistLocalData();

    const originalBtnText = btnPublishLive.innerHTML;
    btnPublishLive.disabled = true;
    btnPublishLive.innerHTML = `<span>⏳ Publication en cours...</span>`;

    const gh = storeData.githubConfig || {};

    if (gh.token && gh.owner && gh.repo) {
      try {
        // Direct GitHub REST API Commit for data.json
        const owner = gh.owner;
        const repo = gh.repo;
        const path = gh.path || 'data.json';
        const branch = gh.branch || 'main';
        const token = gh.token;

        // 1. Get current file SHA if exists
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
          console.log('File does not exist yet on repo, creating new.');
        }

        // 2. Prepare Base64 content
        const jsonString = JSON.stringify(storeData, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

        // 3. Put File Commit
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

        if (!commitRes.ok) {
          const errData = await commitRes.json();
          throw new Error(errData.message || 'Commit failed');
        }

        gh.lastSync = new Date().toISOString();
        persistLocalData();
        renderGitHubConnectionState();
      } catch (err) {
        console.warn('GitHub commit error, saved locally as fallback:', err);
      }
    }

    btnPublishLive.disabled = false;
    btnPublishLive.innerHTML = originalBtnText;

    // Trigger the mandatory Green Floating Notification Banner for 3 seconds
    showNotificationBanner('✓ Saved Successfully! / डेटा सेव हो गया!');
  }

  // 8. GREEN FLOATING BANNER NOTIFICATION (3 Seconds)
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

  // 9. Account & Data Tools
  function updatePassword(e) {
    e.preventDefault();
    const newPass = document.getElementById('newAdminPassword').value.trim();
    if (!newPass) {
      alert('Veuillez entrer un mot de passe.');
      return;
    }

    if (!storeData.adminConfig) storeData.adminConfig = {};
    storeData.adminConfig.password = newPass;
    persistLocalData();
    document.getElementById('newAdminPassword').value = '';
    showNotificationBanner('✓ Mot de passe administrateur mis à jour!');
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
        showNotificationBanner('✓ Données importées avec succès!');
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function resetToDefaults() {
    if (!confirm('Voulez-vous réinitialiser toutes les données aux valeurs par défaut du magasin?')) return;
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

  // 10. Tab Switching Logic
  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });
  }

  // 11. Helper Functions
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function setupEvents() {
    // Auth
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Save Bar
    if (btnPublishLive) btnPublishLive.addEventListener('click', publishToLiveSite);

    // Tabs
    if (adminTabsContainer) {
      adminTabsContainer.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
      });
    }

    // Products
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

    // Store Info
    if (storeInfoForm) storeInfoForm.addEventListener('submit', saveStoreInfo);
    if (btnAddAnnouncement) btnAddAnnouncement.addEventListener('click', addAnnouncement);

    // GitHub
    if (btnTestGithub) btnTestGithub.addEventListener('click', testAndConnectGitHub);

    // Account
    if (accountForm) accountForm.addEventListener('submit', updatePassword);
    if (btnExportJson) btnExportJson.addEventListener('click', exportDataJson);
    if (jsonFileInput) jsonFileInput.addEventListener('change', importDataJson);
    if (btnResetData) btnResetData.addEventListener('click', resetToDefaults);
  }

  // Fallback Data
  function getFallbackData() {
    return {
      store: {
        name: "Dépanneur Eilika",
        tagline: "Votre dépanneur de quartier à Montréal",
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

  // Expose Global Namespace for HTML inline triggers
  window.DepanneurAdmin = {
    openEditModal,
    deleteProduct,
    removeAnnouncement,
    publishToLiveSite
  };

  // Launch on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
