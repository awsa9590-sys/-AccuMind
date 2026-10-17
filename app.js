/* ميزان — نموذج أولي محاسبي يعمل محليًا في المتصفح. */
(() => {
  'use strict';
    // الاتصال بقاعدة بيانات Supabase
  const SUPABASE_URL = 'https://dpmnbthmorzzzqynqswd.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_s6VZuPwcm471z2kZoadVOw_fcnVBS84';

  const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
    // شاشة تسجيل الدخول وإنشاء الحساب
  const authScreen = document.createElement('div');

  authScreen.id = 'mizan-auth-screen';

  authScreen.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #071426;
    direction: rtl;
    font-family: Arial, sans-serif;
  `;

  authScreen.innerHTML = `
    <div style="
      width: 100%;
      max-width: 420px;
      padding: 30px;
      border-radius: 18px;
      background: #fff;
      color: #071426;
      box-shadow: 0 20px 60px #0005;
    ">
      <div style="text-align:center; margin-bottom:24px">
        <h1 style="margin:0 0 10px">ميزان</h1>
        <p style="margin:0;color:#64748b">
          المحاسبة الذكية
        </p>
      </div>

      <h2 id="mizan-auth-title" style="font-size:22px">
        تسجيل الدخول
      </h2>

      <form id="mizan-auth-form">
        <label for="mizan-auth-email">البريد الإلكتروني</label>
        <input
          id="mizan-auth-email"
          type="email"
          autocomplete="email"
          required
          placeholder="name@example.com"
          style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0 18px;border:1px solid #cbd5e1;border-radius:8px"
        >

        <label for="mizan-auth-password">كلمة المرور</label>
        <input
          id="mizan-auth-password"
          type="password"
          autocomplete="current-password"
          required
          minlength="6"
          placeholder="6 أحرف على الأقل"
          style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0 18px;border:1px solid #cbd5e1;border-radius:8px"
        >

        <button
          id="mizan-auth-submit"
          type="submit"
          style="width:100%;padding:13px;background:#0f172a;color:white;border:0;border-radius:8px;cursor:pointer;font-size:16px"
        >
          تسجيل الدخول
        </button>
      </form>

      <p id="mizan-auth-message"
         role="status"
         style="font-size:14px;line-height:1.7"></p>

      <button
        id="mizan-auth-toggle"
        type="button"
        style="width:100%;margin-top:10px;padding:10px;background:transparent;border:0;color:#2563eb;cursor:pointer"
      >
        إنشاء حساب جديد
      </button>
    </div>
  `;

  document.body.appendChild(authScreen);

  let authMode = 'login';

  const authForm = document.getElementById('mizan-auth-form');
  const authEmail = document.getElementById('mizan-auth-email');
  const authPassword = document.getElementById('mizan-auth-password');
  const authMessage = document.getElementById('mizan-auth-message');
  const authSubmit = document.getElementById('mizan-auth-submit');
  const authTitle = document.getElementById('mizan-auth-title');
  const authToggle = document.getElementById('mizan-auth-toggle');

  authToggle.addEventListener('click', () => {
    authMode = authMode === 'login' ? 'signup' : 'login';

    authTitle.textContent =
      authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد';

    authSubmit.textContent =
      authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب';

    authToggle.textContent =
      authMode === 'login'
        ? 'إنشاء حساب جديد'
        : 'لديك حساب؟ سجل الدخول';

    authPassword.autocomplete =
      authMode === 'login' ? 'current-password' : 'new-password';

    authMessage.textContent = '';
  });

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    authSubmit.disabled = true;
    authMessage.style.color = '#475569';
    authMessage.textContent = 'جارٍ تنفيذ الطلب...';

    try {
      const email = authEmail.value.trim();
      const password = authPassword.value;

      const result = authMode === 'login'
        ? await sb.auth.signInWithPassword({ email, password })
        : await sb.auth.signUp({ email, password });

      if (result.error) throw result.error;

      if (authMode === 'signup' && !result.data.session) {
        authMessage.style.color = '#15803d';
        authMessage.textContent =
          'تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.';
      } else if (result.data.session) {
        authMessage.style.color = '#15803d';
        authMessage.textContent = 'تم تسجيل الدخول بنجاح.';
      } else {
        authMessage.textContent =
          'تم الطلب. اتبع التعليمات الظاهرة لك لإكمال الدخول.';
      }
    } catch (error) {
      authMessage.style.color = '#dc2626';
      authMessage.textContent =
        error.message || 'حدث خطأ. حاول مرة أخرى.';
    } finally {
      authSubmit.disabled = false;
    }
  });
  // إظهار التطبيق للمستخدم المسجل فقط
 
  // إنشاء شريط الحساب داخل صفحة الإعدادات والبيانات
  const accountBar = document.createElement('div');
  accountBar.id = 'mizan-account-bar';

  accountBar.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin: 16px 0;
    padding: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
    direction: rtl;
    font-family: Arial, sans-serif;
  `;

  accountBar.innerHTML = `
    <div>
      <div style="font-weight:bold;margin-bottom:6px">
        الحساب المسجل
      </div>
      <span id="mizan-account-email"
        style="overflow-wrap:anywhere;color:#475569"></span>
    </div>

    <button id="mizan-logout" type="button"
      style="padding:10px 14px;background:#dc2626;color:white;border:0;border-radius:8px;cursor:pointer">
      تسجيل الخروج
    </button>
  `;
  // إضافة شريط الحساب داخل صفحة الإعدادات
  accountBar.style.display = 'none';

  const settingsContainer = document.querySelector('#page-settings');

  if (settingsContainer) {
    const settingsForm = settingsContainer.querySelector('#settingsForm');

    if (settingsForm) {
      settingsForm.insertAdjacentElement('beforebegin', accountBar);
    } else {
      settingsContainer.appendChild(accountBar);
    }
  }
  const updateMizanAuthUI = (session) => {
    const loggedIn = Boolean(session);

    // إظهار شاشة تسجيل الدخول عند عدم وجود جلسة
    authScreen.style.display = loggedIn ? 'none' : 'flex';

    // إظهار شريط الحساب فقط داخل صفحة الإعدادات
    const settingsPage = document.querySelector('#page-settings');
    const settingsIsActive =
      settingsPage?.classList.contains('active') || false;

    accountBar.style.display =
      loggedIn && settingsIsActive ? 'flex' : 'none';

    document.getElementById('mizan-account-email').textContent =
      session?.user?.email || 'حسابي';
  };

  sb.auth.onAuthStateChange((_event, session) => {
    updateMizanAuthUI(session);
  });

  sb.auth.getSession().then(({ data, error }) => {
    if (error) {
      authMessage.textContent = 'تعذر التحقق من تسجيل الدخول.';
      updateMizanAuthUI(null);
      return;
    }

    updateMizanAuthUI(data.session);
  });
  const STORE = { transactions: 'mizan_transactions_v8', products: 'mizan_products_v8', contacts: 'mizan_contacts_v8', settings: 'mizan_settings_v8', journals: 'mizan_journals_v1', documents: 'mizan_erp_documents_v1', assets: 'mizan_fixed_assets_v1', projects: 'mizan_projects_v1', bankItems: 'mizan_bank_items_v1', auditLog: 'mizan_audit_log_v1' };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const typeLabels = { income: 'إيراد', sale: 'بيع', expense: 'مصروف', purchase: 'شراء' };
  const typeIcons = { income: 'fa-arrow-down', sale: 'fa-bag-shopping', expense: 'fa-arrow-up', purchase: 'fa-cart-shopping' };
  const categoryDefaults = ['مبيعات', 'خدمات', 'مشتريات بضاعة', 'رواتب', 'إيجار', 'تسويق', 'إنترنت واتصالات', 'نقل وشحن', 'أدوات مكتبية', 'صيانة', 'مرافق', 'أخرى'];
  let state = { transactions: [], products: [], contacts: [], journals: [], documents: [], assets: [], projects: [], bankItems: [], auditLog: [], settings: { businessName: 'مشروعي التجاري', ownerName: '', currency: 'EGP', taxRate: 14 } };
  let modalKind = null, editingId = null, selectedInvoiceFile = null, extractedOcr = '';

  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const dateOffset = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const id = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const money = (value, short = false) => {
    const currency = state.settings.currency || 'EGP';
    try { return new Intl.NumberFormat('ar-EG', { style: 'currency', currency, maximumFractionDigits: 2, notation: short ? 'compact' : 'standard' }).format(Number(value) || 0); }
    catch { return `${new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(Number(value) || 0)} ${currency}`; }
  };
  const num = (value) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(Number(value) || 0);
  const dateText = (value) => {
    if (!value) return '—';
    const d = new Date(`${value}T12:00:00`);
    return Number.isNaN(d.getTime()) ? esc(value) : new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isThisMonth = (date) => { const d = new Date(`${date}T12:00:00`); const now = new Date(); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); };
  const total = (items, predicate, key = 'amount') => items.filter(predicate).reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  const revenues = (items = state.transactions) => total(items, t => ['income', 'sale'].includes(t.type));
  const expenses = (items = state.transactions) => total(items, t => ['expense', 'purchase'].includes(t.type));
  const stockValue = () => total(state.products, () => true, 'value');
  const productValue = (p) => (Number(p.quantity) || 0) * (Number(p.cost) || 0);
  const moneyTypeClass = (type) => ['income', 'sale'].includes(type) ? 'amount-positive' : 'amount-negative';
  const toast = (message, isError = false) => {
    const node = document.createElement('div'); node.className = `toast${isError ? ' error' : ''}`;
    node.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i><span>${esc(message)}</span>`;
    $('#toastRegion').append(node); setTimeout(() => node.remove(), 3600);
  };
  const save = () => {
    try {
      localStorage.setItem(STORE.transactions, JSON.stringify(state.transactions));
      localStorage.setItem(STORE.products, JSON.stringify(state.products));
      localStorage.setItem(STORE.contacts, JSON.stringify(state.contacts));
      localStorage.setItem(STORE.settings, JSON.stringify(state.settings));
      ['journals','documents','assets','projects','bankItems','auditLog'].forEach(key => localStorage.setItem(STORE[key], JSON.stringify(state[key] || [])));
    } catch (e) { console.error(e); toast('تعذر الحفظ المحلي. قد تكون مساحة التخزين ممتلئة.', true); }
  };
  const makeDemoData = () => ({
    transactions: [
      { id: id(), date: dateOffset(-1), type: 'income', category: 'خدمات', description: 'تحصيل مقابل خدمات محاسبية', amount: 12500, tax: 0, contact: 'شركة النور للتجارة', note: 'دفعة مستلمة' },
      { id: id(), date: dateOffset(-2), type: 'purchase', category: 'مشتريات بضاعة', description: 'شراء بضاعة للمخزن', amount: 8750, tax: 14, contact: 'شركة الأمل', note: 'فاتورة شراء' },
      { id: id(), date: dateOffset(-3), type: 'expense', category: 'إنترنت واتصالات', description: 'فاتورة الإنترنت', amount: 450, tax: 14, contact: 'شركة الاتصالات', note: '' },
      { id: id(), date: dateOffset(-4), type: 'expense', category: 'تسويق', description: 'مصروفات تسويق', amount: 3200, tax: 14, contact: 'وكالة تسويق', note: 'حملة شهرية' },
      { id: id(), date: dateOffset(-5), type: 'sale', category: 'مبيعات', description: 'بيع أجهزة وإكسسوارات', amount: 7800, tax: 14, contact: 'عميل نقدي', note: '' },
      { id: id(), date: dateOffset(-6), type: 'expense', category: 'رواتب', description: 'رواتب الموظفين', amount: 25000, tax: 0, contact: 'الموظفون', note: 'رواتب شهرية' },
      { id: id(), date: dateOffset(-8), type: 'income', category: 'مبيعات', description: 'مبيعات نقدية', amount: 9400, tax: 0, contact: 'عميل نقدي', note: '' },
      { id: id(), date: dateOffset(-10), type: 'expense', category: 'إيجار', description: 'إيجار المقر', amount: 6000, tax: 0, contact: 'مالك العقار', note: '' }
    ],
    products: [
      { id: id(), name: 'لابتوب أعمال', sku: 'PRD-001', quantity: 15, cost: 12500, reorder: 4 },
      { id: id(), name: 'هاتف ذكي', sku: 'PRD-002', quantity: 8, cost: 6200, reorder: 10 },
      { id: id(), name: 'سماعات لاسلكية', sku: 'PRD-003', quantity: 32, cost: 850, reorder: 5 },
      { id: id(), name: 'شاحن سريع', sku: 'PRD-004', quantity: 5, cost: 240, reorder: 8 }
    ],
    contacts: [
      { id: id(), name: 'شركة النور للتجارة', type: 'customer', phone: '01000000001', balance: 15000, notes: 'عميل رئيسي' },
      { id: id(), name: 'مؤسسة المستقبل', type: 'customer', phone: '01000000002', balance: 8500, notes: '' },
      { id: id(), name: 'مطعم لذيذ', type: 'customer', phone: '01000000003', balance: 3200, notes: '' },
      { id: id(), name: 'شركة الأمل', type: 'supplier', phone: '0220000001', balance: 12000, notes: 'توريد بضاعة' },
      { id: id(), name: 'مكتبة النيل', type: 'supplier', phone: '0220000002', balance: 6500, notes: '' }
    ]
  });
  const readSaved = () => {
    try {
      const loaded = {};
      Object.keys(STORE).forEach(key => { const raw = localStorage.getItem(STORE[key]); loaded[key] = raw === null ? null : JSON.parse(raw); });
      ['transactions','products','contacts','journals','documents','assets','projects','bankItems','auditLog'].forEach(key => { if (Array.isArray(loaded[key])) state[key] = loaded[key]; });
      if (loaded.settings && typeof loaded.settings === 'object') state.settings = { ...state.settings, ...loaded.settings };
      if ([loaded.transactions, loaded.products, loaded.contacts].every(v => v === null)) { const demo = makeDemoData(); state.transactions = demo.transactions; state.products = demo.products; state.contacts = demo.contacts; save(); }
      if (!Array.isArray(state.transactions) || !Array.isArray(state.products) || !Array.isArray(state.contacts)) throw new Error('bad data');
    } catch (e) { console.warn('Could not load saved data', e); state = { transactions: [], products: [], contacts: [], journals: [], documents: [], assets: [], projects: [], bankItems: [], auditLog: [], settings: { businessName: 'مشروعي التجاري', ownerName: '', currency: 'EGP', taxRate: 14 } }; toast('تعذر قراءة البيانات السابقة؛ تم بدء مساحة عمل فارغة.', true); }
  };

  const goTo = (page) => {
    const labels = { dashboard: 'لوحة القيادة', transactions: 'المعاملات والقيود', inventory: 'المخزون', contacts: 'العملاء والموردون', erp: 'مركز ERP المتقدم', reports: 'التقارير المالية', assistant: 'المساعد الذكي', settings: 'الإعدادات' };
    $$('.page').forEach(el => el.classList.toggle('active', el.id === `page-${page}`));
    $$('.nav-link[data-page]').forEach(el => el.classList.toggle('active', el.dataset.page === page));
    $('#pageCrumb').textContent = labels[page] || labels.dashboard;
    $('#pageTitle').textContent = page === 'dashboard' ? 'أهلًا بك في ميزان 👋' : labels[page];
    $('#sidebar').classList.remove('open');
    if (page === 'reports') renderReport(); if (page === 'erp') renderERP(); if (page === 'dashboard') requestAnimationFrame(drawChart);
     sb.auth.getSession().then(({ data, error }) => {
      if (error) {
        updateMizanAuthUI(null);
        return;
      }

      updateMizanAuthUI(data?.session || null);
    });
  };
  const monthTransactions = () => state.transactions.filter(t => isThisMonth(t.date));
  const periodTransactions = () => $('#dashboardPeriod').value === 'all' ? state.transactions : monthTransactions();

  function renderDashboard() {
    const txs = periodTransactions(); const income = revenues(txs), expense = expenses(txs), profit = income - expense;
    $('#statIncome').textContent = money(income); $('#statExpense').textContent = money(expense); $('#statProfit').textContent = money(profit);
    $('#statProfit').style.color = profit >= 0 ? 'var(--teal)' : 'var(--rose)';
    $('#statInventory').textContent = money(state.products.reduce((s,p) => s + productValue(p),0));
    $('#inventoryItems').textContent = `${num(state.products.length)} صنف`;
    $('#transactionCount').textContent = state.transactions.length;
    const current = monthTransactions(); const prev = state.transactions.filter(t => { const d = new Date(`${t.date}T12:00:00`); const n = new Date(); const p = new Date(n.getFullYear(), n.getMonth()-1, 1); return d.getFullYear() === p.getFullYear() && d.getMonth() === p.getMonth(); });
    const trendText = (now, before) => before === 0 ? (now === 0 ? '0%' : 'جديد') : `${now >= before ? '+' : ''}${Math.round((now-before)/before*100)}%`;
    $('#incomeTrend').textContent = trendText(revenues(current), revenues(prev)); $('#expenseTrend').textContent = trendText(expenses(current), expenses(prev));
    $('#profitTrend').innerHTML = profit >= 0 ? '<i class="fa-solid fa-circle-check"></i> موجب' : '<i class="fa-solid fa-triangle-exclamation"></i> سالب';
    const recent = [...state.transactions].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);
    $('#recentTransactions').innerHTML = recent.map(t => `<tr><td><div class="transaction-name"><span class="transaction-symbol"><i class="fa-solid ${typeIcons[t.type] || 'fa-receipt'}"></i></span>${esc(t.description)}</div></td><td>${esc(t.category || typeLabels[t.type])}</td><td>${dateText(t.date)}</td><td><span class="${moneyTypeClass(t.type)}">${['income','sale'].includes(t.type)?'+':'−'} ${money(t.amount)}</span></td><td><span class="status-badge">مسجلة</span></td></tr>`).join('');
    $('#recentEmpty').classList.toggle('hidden', recent.length > 0);
    const expenseTx = txs.filter(t => ['expense','purchase'].includes(t.type)); const byCategory = {};
    expenseTx.forEach(t => { const name = t.category || 'أخرى'; byCategory[name] = (byCategory[name] || 0) + Number(t.amount || 0); });
    const cats = Object.entries(byCategory).sort((a,b) => b[1]-a[1]);
    const colors = ['var(--teal)','var(--blue)','var(--violet)','var(--amber)'];
    const topCats = cats.slice(0,3); const rest = cats.slice(3).reduce((s,c) => s+c[1],0); if (rest) topCats.push(['أخرى',rest]);
    let angle=0; const stopParts=[]; topCats.forEach((c,i) => { const deg = expense ? c[1]/expense*360 : 0; stopParts.push(`${colors[i%colors.length]} ${angle}deg ${angle+deg}deg`); angle += deg; }); if (!expense) stopParts.push('#203b57 0deg 360deg');
    $('#expenseDonut').style.background = `conic-gradient(${stopParts.join(',')})`; $('#donutTotal').textContent = num(expense);
    $('#categoryLegend').innerHTML = topCats.length ? topCats.map((c,i)=>`<div class="category-row"><span class="category-name"><i class="legend-dot" style="background:${colors[i%colors.length]}"></i>${esc(c[0])}</span><strong>${money(c[1])}</strong></div>`).join('') : '<small style="color:var(--muted)">لا توجد مصروفات مسجلة في هذه الفترة.</small>';
    renderInsights(txs); requestAnimationFrame(drawChart);
  }
  function renderInsights(txs) {
    const income = revenues(txs), expense = expenses(txs), profit = income - expense;
    const byCategory = {}; txs.filter(t => ['expense','purchase'].includes(t.type)).forEach(t => byCategory[t.category || 'أخرى'] = (byCategory[t.category || 'أخرى'] || 0) + Number(t.amount || 0));
    const top = Object.entries(byCategory).sort((a,b)=>b[1]-a[1])[0]; const low = state.products.filter(p => Number(p.quantity) <= Number(p.reorder));
    const items = [];
    if (top) items.push({ icon:'fa-chart-pie', title:'أعلى بند في المصروفات', body:`${top[0]} بإجمالي ${money(top[1])} ضمن الفترة المحددة.` });
    items.push({ icon:profit>=0?'fa-arrow-trend-up':'fa-triangle-exclamation', title:profit>=0?'صافي النتيجة موجب':'مراجعة المصروفات', body:profit>=0?`صافي الفرق بين الإيرادات والمصروفات ${money(profit)}. تأكد من تسجيل كل الالتزامات.`:`المصروفات تتجاوز الإيرادات بمقدار ${money(Math.abs(profit))} وفق السجلات الحالية.` });
    if (low.length) items.push({ icon:'fa-box-open', title:'تنبيه مخزون', body:`${low.length} صنفًا عند حد إعادة الطلب أو أقل: ${low.slice(0,3).map(p=>p.name).join('، ')}.` });
    if (!top && !low.length && !state.transactions.length) items.push({ icon:'fa-wand-magic-sparkles', title:'ابدأ بتسجيل أول حركة', body:'بعد إضافة الحركات، ستظهر هنا ملاحظات مبنية على الأرقام المسجلة.' });
    $('#insightsList').innerHTML = items.slice(0,3).map(x=>`<div class="insight-item"><span class="insight-symbol"><i class="fa-solid ${x.icon}"></i></span><div><strong>${esc(x.title)}</strong><p>${esc(x.body)}</p></div></div>`).join('');
  }
  function drawChart() {
    const canvas = $('#cashflowChart'); if (!canvas || !$('#page-dashboard').classList.contains('active')) return;
    const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return;
    const ratio = window.devicePixelRatio || 1; canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
    const ctx = canvas.getContext('2d'); ctx.scale(ratio,ratio);
    const w=rect.width,h=rect.height,pad={l:42,r:12,t:13,b:28},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
    ctx.clearRect(0,0,w,h); const labels=[]; const inc=[]; const exp=[]; const now=new Date();
    for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;labels.push(new Intl.DateTimeFormat('ar-EG',{day:'numeric',month:'numeric'}).format(d));const day=state.transactions.filter(t=>t.date===key);inc.push(revenues(day));exp.push(expenses(day));}
    const max=Math.max(100,...inc,...exp)*1.18;
    for(let i=0;i<5;i++){const y=pad.t+ch*i/4;ctx.beginPath();ctx.strokeStyle='#1b3550';ctx.lineWidth=1;ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillStyle='#6b86a2';ctx.font='10px Cairo, sans-serif';ctx.textAlign='right';ctx.fillText(num(max*(1-i/4)),pad.l-8,y+3);}
    const xAt=i=>pad.l+(cw*(i/(labels.length-1 || 1))); const yAt=v=>pad.t+ch-(v/max*ch);
    const line=(data,color)=>{ctx.beginPath();data.forEach((v,i)=>{const x=xAt(i),y=yAt(v);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();data.forEach((v,i)=>{ctx.beginPath();ctx.arc(xAt(i),yAt(v),3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();});};
    line(inc,'#13d6b0');line(exp,'#ff597d');
    ctx.fillStyle='#718ba7';ctx.font='10px Cairo, sans-serif';ctx.textAlign='center';labels.forEach((label,i)=>ctx.fillText(label,xAt(i),h-7));
    if(inc.every(v=>v===0)&&exp.every(v=>v===0)){ctx.fillStyle='#6f8aa8';ctx.textAlign='center';ctx.font='11px Cairo, sans-serif';ctx.fillText('سجّل حركات بتاريخ اليوم لعرضها في الرسم',w/2,h/2);}
  }

  function logAudit(action, detail) {
    state.auditLog.unshift({ id: id(), at: new Date().toISOString(), action, detail });
    state.auditLog = state.auditLog.slice(0, 60);
  }
  const docTypeLabels = { sale: 'مبيعات', purchase: 'مشتريات' };
  const docStatusLabels = { draft: 'مسودة', approved: 'معتمدة', posted: 'مرحّلة' };
  const projectTypeLabels = { project: 'مشروع', manufacturing: 'أمر إنتاج' };
  const assetDepreciationMonthly = (a) => Math.max(0, (Number(a.cost) - Number(a.residual || 0)) / Math.max(1, Number(a.lifeYears) || 1) / 12);
  const monthsBetween = (start, end = todayISO()) => {
    if (!start) return 0; const a = new Date(`${start}T12:00:00`), b = new Date(`${end}T12:00:00`);
    if (Number.isNaN(a.getTime()) || a > b) return 0;
    return Math.max(0, (b.getFullYear()-a.getFullYear())*12 + b.getMonth()-a.getMonth());
  };

  const field = (label, name, type='text', value='', options={}) => {
    const full = options.full ? ' field-full' : ''; const required = options.required === false ? '' : ' required'; const placeholder = options.placeholder ? ` placeholder="${esc(options.placeholder)}"` : '';
    if (type === 'select') return `<label class="${full}">${esc(label)}<select name="${esc(name)}"${required}>${options.choices.map(c=>`<option value="${esc(c.value)}" ${String(c.value)===String(value)?'selected':''}>${esc(c.label)}</option>`).join('')}</select></label>`;
    if (type === 'textarea') return `<label class="${full}">${esc(label)}<textarea name="${esc(name)}"${required} ${placeholder}>${esc(value)}</textarea></label>`;
    const min = options.min !== undefined ? ` min="${options.min}"` : ''; const max = options.max !== undefined ? ` max="${options.max}"` : ''; const step = options.step ? ` step="${options.step}"` : '';
    return `<label class="${full}">${esc(label)}<input name="${esc(name)}" type="${type}" value="${esc(value)}"${required}${placeholder}${min}${max}${step}></label>`;
  };
  const openModal = (kind, item = null, defaults = {}) => {
    modalKind = kind; editingId = item?.id || null; const val = { ...(item || {}), ...defaults };
    let title = '', subtitle = '', fields = '';
    if (kind === 'transaction') {
      title = item ? 'تعديل حركة مالية' : 'إضافة حركة مالية'; subtitle = 'أدخل تفاصيل العملية بدقة ليتم تحديث المؤشرات والتقارير.';
      fields += field('نوع الحركة','type','select',val.type || 'expense',{choices:[{value:'income',label:'إيراد'},{value:'sale',label:'بيع'},{value:'expense',label:'مصروف'},{value:'purchase',label:'شراء'}]});
      fields += field('تاريخ الحركة','date','date',val.date || todayISO());
      fields += field('وصف العملية','description','text',val.description || '',{full:true,placeholder:'مثال: شراء مستلزمات مكتبية'});
      fields += field('التصنيف','category','select',val.category || (val.type==='income'?'مبيعات':val.type==='purchase'?'مشتريات بضاعة':'أخرى'),{choices:categoryDefaults.map(x=>({value:x,label:x}))});
      fields += field('المبلغ قبل الضريبة','amount','number',val.amount ?? '',{min:0,step:'0.01'});
      fields += field('الضريبة (%)','tax','number',val.tax ?? state.settings.taxRate,{min:0,max:100,step:'0.1'});
      fields += field('العميل / المورد','contact','text',val.contact || '',{placeholder:'اسم جهة التعامل',required:false});
      fields += field('ملاحظات','note','textarea',val.note || '',{full:true,required:false,placeholder:'أي تفاصيل إضافية'});
    } else if (kind === 'product') {
      title = item ? 'تعديل صنف' : 'إضافة صنف للمخزون'; subtitle = 'أدخل الكمية والتكلفة وحد إعادة الطلب.';
      fields += field('اسم الصنف','name','text',val.name||'',{full:true,placeholder:'اسم المنتج'}); fields += field('رمز الصنف / SKU','sku','text',val.sku||'',{placeholder:'مثال: PRD-005',required:false}); fields += field('الكمية الحالية','quantity','number',val.quantity??0,{min:0,step:'1'}); fields += field('تكلفة الوحدة','cost','number',val.cost??0,{min:0,step:'0.01'}); fields += field('حد إعادة الطلب','reorder','number',val.reorder??5,{min:0,step:'1'});
    } else if (kind === 'contact') {
      title = item ? 'تعديل جهة تعامل' : 'إضافة عميل أو مورد'; subtitle = 'الأرصدة تُدخل يدويًا في هذه النسخة.';
      fields += field('نوع الجهة','type','select',val.type||'customer',{choices:[{value:'customer',label:'عميل'},{value:'supplier',label:'مورد'}]}); fields += field('اسم الجهة','name','text',val.name||'',{full:true}); fields += field('رقم الهاتف','phone','tel',val.phone||'',{required:false,placeholder:'رقم الهاتف'}); fields += field('الرصيد المستحق (ج.م حسب عملة التطبيق)','balance','number',val.balance??0,{min:0,step:'0.01'}); fields += field('ملاحظات','notes','textarea',val.notes||'',{full:true,required:false});
    } else if (kind === 'journal') {
      title = item ? 'تعديل قيد يومي' : 'إضافة قيد يومي مزدوج'; subtitle = 'اختر الطرف المدين والدائن؛ يتم تسجيل القيمة نفسها للطرفين لضمان توازن هذا القيد المبسط.';
      fields += field('التاريخ','date','date',val.date||todayISO());
      fields += field('البيان','description','text',val.description||'',{full:true,placeholder:'مثال: إثبات فاتورة خدمات'});
      const accounts = ['الصندوق','البنك','العملاء','المخزون','الأصول الثابتة','المشتريات','المصروفات','الموردون','الإيرادات','رأس المال','مصروف الإهلاك','مجمع الإهلاك','ضريبة القيمة المضافة','ضريبة القيمة المضافة - مدخلات'];
      fields += field('الحساب المدين','debitAccount','select',val.debitAccount||'المصروفات',{choices:accounts.map(x=>({value:x,label:x}))});
      fields += field('الحساب الدائن','creditAccount','select',val.creditAccount||'الصندوق',{choices:accounts.map(x=>({value:x,label:x}))});
      fields += field('المبلغ','amount','number',val.amount??'',{min:0.01,step:'0.01'});
      fields += field('مركز التكلفة / الفرع','costCenter','text',val.costCenter||'',{required:false,placeholder:'مثال: فرع القاهرة'});
      fields += field('رقم مرجعي','reference','text',val.reference||'',{required:false,placeholder:'رقم مستند أو فاتورة'});
    } else if (kind === 'salesdoc' || kind === 'purchasedoc') {
      const docType = kind === 'salesdoc' ? 'sale' : 'purchase'; title = kind === 'salesdoc' ? 'فاتورة مبيعات جديدة' : 'فاتورة مشتريات جديدة'; subtitle = 'تبدأ الفاتورة كمسودة، ثم اعتمادها ثم ترحيلها إلى المعاملات المالية.';
      fields += field('رقم الفاتورة','number','text',val.number||`INV-${String(Date.now()).slice(-6)}`,{required:true});
      fields += field('التاريخ','date','date',val.date||todayISO());
      fields += field(kind==='salesdoc'?'اسم العميل':'اسم المورد','contact','text',val.contact||'',{full:true,placeholder:'اسم جهة التعامل'});
      fields += field('البيان','description','text',val.description||(docType==='sale'?'فاتورة مبيعات':'فاتورة مشتريات'),{full:true});
      fields += field('القيمة قبل الضريبة','subtotal','number',val.subtotal??'',{min:0.01,step:'0.01'});
      fields += field('ضريبة القيمة المضافة (%)','taxRate','number',val.taxRate??state.settings.taxRate,{min:0,max:100,step:'0.1'});
      fields += field('مركز التكلفة / الفرع','costCenter','text',val.costCenter||'',{required:false});
    } else if (kind === 'asset') {
      title = 'إضافة أصل ثابت'; subtitle = 'حساب خط مستقيم مبسط للإهلاك؛ يحتاج دفتر الأصول النهائي إلى مراجعة محاسبية.';
      fields += field('اسم الأصل','name','text',val.name||'',{full:true,placeholder:'مثال: جهاز كمبيوتر'});
      fields += field('تاريخ الشراء / بدء الاستخدام','date','date',val.date||todayISO());
      fields += field('تكلفة الأصل','cost','number',val.cost??'',{min:0.01,step:'0.01'});
      fields += field('العمر الإنتاجي (بالسنوات)','lifeYears','number',val.lifeYears??5,{min:1,max:100,step:'1'});
      fields += field('القيمة التخريدية','residual','number',val.residual??0,{min:0,step:'0.01'});
      fields += field('مركز التكلفة','costCenter','text',val.costCenter||'',{required:false});
    } else if (kind === 'project') {
      title = 'إضافة مشروع أو أمر إنتاج'; subtitle = 'سجّل الموازنة والتكلفة الفعلية لمتابعة الانحرافات.';
      fields += field('النوع','type','select',val.type||'project',{choices:[{value:'project',label:'مشروع / مقاولة'},{value:'manufacturing',label:'أمر إنتاج / تصنيع'}]});
      fields += field('الاسم','name','text',val.name||'',{full:true,placeholder:'اسم المشروع أو أمر الإنتاج'});
      fields += field('العميل / خط الإنتاج','customer','text',val.customer||'',{required:false});
      fields += field('تاريخ البدء','date','date',val.date||todayISO());
      fields += field('الموازنة المعتمدة','budget','number',val.budget??0,{min:0,step:'0.01'});
      fields += field('التكلفة الفعلية حتى الآن','actualCost','number',val.actualCost??0,{min:0,step:'0.01'});
      fields += field('الحالة','status','select',val.status||'active',{choices:[{value:'active',label:'قائم'},{value:'on-hold',label:'متوقف مؤقتًا'},{value:'closed',label:'مغلق'}]});
      fields += field('مركز التكلفة','costCenter','text',val.costCenter||'',{required:false});
    } else if (kind === 'bank') {
      title = 'إضافة حركة بنكية'; subtitle = 'بعد المطابقة اليدوية يمكنك وضع علامة «تمت المطابقة».';
      fields += field('التاريخ','date','date',val.date||todayISO());
      fields += field('البيان','description','text',val.description||'',{full:true,placeholder:'مثال: إيداع مبيعات'});
      fields += field('الاتجاه','direction','select',val.direction||'in',{choices:[{value:'in',label:'إيداع / وارد'},{value:'out',label:'سحب / صادر'}]});
      fields += field('المبلغ','amount','number',val.amount??'',{min:0.01,step:'0.01'});
      fields += field('المرجع البنكي','reference','text',val.reference||'',{required:false,placeholder:'رقم العملية أو الشيك'});
    }
    $('#modalTitle').textContent = title; $('#modalSubtitle').textContent = subtitle; $('#modalFields').innerHTML = fields; $('#modalBackdrop').classList.remove('hidden');
    setTimeout(() => $('#modalFields input, #modalFields select')?.focus(), 50);
  };
  const closeModal = () => { $('#modalBackdrop').classList.add('hidden'); $('#modalForm').reset(); modalKind = null; editingId = null; };
  const formObject = (form) => Object.fromEntries(new FormData(form).entries());
  function saveModal(e) {
    e.preventDefault(); if (!modalKind) return;
    const v = formObject(e.currentTarget);
    if (modalKind === 'transaction') {
      const amount=Number(v.amount); if (!(amount>=0) || !Number.isFinite(amount)) return toast('أدخل مبلغًا صحيحًا.',true);
      const item={ id:editingId||id(), date:v.date, type:v.type, description:v.description.trim(), category:v.category, amount, tax:Math.max(0,Math.min(100,Number(v.tax)||0)), contact:v.contact.trim(), note:v.note.trim() };
      if (!item.description) return toast('اكتب وصف العملية.',true);
      if (editingId) state.transactions=state.transactions.map(t=>t.id===editingId?item:t); else state.transactions.unshift(item);
      logAudit(editingId?'تعديل حركة':'إضافة حركة',item.description); toast(editingId?'تم تعديل الحركة.':'تمت إضافة الحركة.');
    } else if (modalKind === 'product') {
      const item={id:editingId||id(),name:v.name.trim(),sku:v.sku.trim(),quantity:Number(v.quantity),cost:Number(v.cost),reorder:Number(v.reorder)};
      if(!item.name || [item.quantity,item.cost,item.reorder].some(n=>!Number.isFinite(n)||n<0)) return toast('راجع اسم الصنف والكميات والتكلفة.',true);
      if(editingId)state.products=state.products.map(p=>p.id===editingId?item:p);else state.products.push(item);logAudit(editingId?'تعديل صنف':'إضافة صنف',item.name);toast(editingId?'تم تعديل الصنف.':'تمت إضافة الصنف.');
    } else if (modalKind === 'contact') {
      const item={id:editingId||id(),name:v.name.trim(),type:v.type,phone:v.phone.trim(),balance:Number(v.balance),notes:v.notes.trim()};
      if(!item.name || !Number.isFinite(item.balance)||item.balance<0)return toast('راجع اسم الجهة والرصيد.',true);
      if(editingId)state.contacts=state.contacts.map(c=>c.id===editingId?item:c);else state.contacts.push(item);logAudit(editingId?'تعديل جهة تعامل':'إضافة جهة تعامل',item.name);toast(editingId?'تم تعديل جهة التعامل.':'تمت إضافة جهة التعامل.');
    } else if (modalKind === 'journal') {
      const amount=Number(v.amount); if(!v.description.trim()||!v.debitAccount||!v.creditAccount||v.debitAccount===v.creditAccount||!(amount>0)||!Number.isFinite(amount)) return toast('أدخل بيانًا ومبلغًا موجبًا واختر حسابين مختلفين.',true);
      const item={id:editingId||id(),date:v.date,description:v.description.trim(),debitAccount:v.debitAccount,creditAccount:v.creditAccount,amount,costCenter:v.costCenter.trim(),reference:v.reference.trim(),debit:amount,credit:amount};
      if(editingId)state.journals=state.journals.map(j=>j.id===editingId?item:j);else state.journals.unshift(item);logAudit(editingId?'تعديل قيد يومي':'إضافة قيد يومي',`${item.description} — ${money(amount)}`);toast('تم حفظ القيد المتوازن.');
    } else if (modalKind === 'salesdoc' || modalKind === 'purchasedoc') {
      const subtotal=Number(v.subtotal), taxRate=Math.max(0,Math.min(100,Number(v.taxRate)||0));
      if(!v.number.trim()||!v.date||!v.contact.trim()||!v.description.trim()||!(subtotal>0)||!Number.isFinite(subtotal))return toast('راجع رقم الفاتورة والجهة والبيان والمبلغ.',true);
      if(state.documents.some(d=>d.number===v.number.trim()&&d.id!==editingId))return toast('رقم الفاتورة مستخدم بالفعل.',true);
      const type=modalKind==='salesdoc'?'sale':'purchase';
      const taxAmount=Math.round(subtotal*taxRate)/100; const totalAmount=Math.round((subtotal+taxAmount)*100)/100; const item={id:editingId||id(),number:v.number.trim(),type,date:v.date,contact:v.contact.trim(),description:v.description.trim(),subtotal,taxRate,taxAmount,total:totalAmount,costCenter:v.costCenter.trim(),status:'draft',transactionId:null};
      if(editingId)state.documents=state.documents.map(d=>d.id===editingId?item:d);else state.documents.unshift(item);logAudit('إنشاء فاتورة',`${docTypeLabels[type]} ${item.number}`);toast('حُفظت الفاتورة كمسودة. اعتمدها ثم رحّلها لتسجيل أثرها المالي.');
    } else if (modalKind === 'asset') {
      const item={id:editingId||id(),name:v.name.trim(),date:v.date,cost:Number(v.cost),lifeYears:Number(v.lifeYears),residual:Number(v.residual)||0,costCenter:v.costCenter.trim()};
      if(!item.name||!(item.cost>0)||!Number.isFinite(item.cost)||!(item.lifeYears>0)||item.residual<0||item.residual>item.cost)return toast('راجع اسم الأصل والتكلفة والعمر والقيمة التخريدية.',true);
      if(editingId)state.assets=state.assets.map(a=>a.id===editingId?item:a);else state.assets.unshift(item);logAudit('إضافة أصل ثابت',item.name);toast('تم حفظ بيانات الأصل.');
    } else if (modalKind === 'project') {
      const item={id:editingId||id(),type:v.type,name:v.name.trim(),customer:v.customer.trim(),date:v.date,budget:Number(v.budget),actualCost:Number(v.actualCost),status:v.status,costCenter:v.costCenter.trim()};
      if(!item.name||[item.budget,item.actualCost].some(n=>!Number.isFinite(n)||n<0))return toast('راجع اسم المشروع والموازنة والتكلفة.',true);
      if(editingId)state.projects=state.projects.map(x=>x.id===editingId?item:x);else state.projects.unshift(item);logAudit('تحديث مشروع / أمر إنتاج',item.name);toast('تم حفظ بيانات المشروع أو أمر الإنتاج.');
    } else if (modalKind === 'bank') {
      const amount=Number(v.amount);if(!v.description.trim()||!(amount>0)||!Number.isFinite(amount))return toast('أدخل بيانًا ومبلغًا موجبًا للحركة البنكية.',true);
      const item={id:editingId||id(),date:v.date,description:v.description.trim(),direction:v.direction,amount,reference:v.reference.trim(),reconciled:false};
      if(editingId)state.bankItems=state.bankItems.map(b=>b.id===editingId?item:b);else state.bankItems.unshift(item);logAudit('إضافة حركة بنكية',item.description);toast('تم تسجيل الحركة البنكية.');
    }
    save(); closeModal(); renderAll();
  }

  function renderTransactions() {
    const query = ($('#transactionSearch').value||'').trim().toLowerCase(); const type=$('#transactionTypeFilter').value; const period=$('#transactionPeriodFilter').value;
    const items=[...state.transactions].sort((a,b)=>b.date.localeCompare(a.date)).filter(t=>(type==='all'||t.type===type)&&(period!=='month'||isThisMonth(t.date))&&[t.description,t.category,t.contact,t.note].join(' ').toLowerCase().includes(query));
    $('#transactionsTable').innerHTML=items.map(t=>`<tr><td><div class="transaction-name"><span class="transaction-symbol"><i class="fa-solid ${typeIcons[t.type]||'fa-receipt'}"></i></span>${esc(t.description)}</div></td><td><span class="type-badge ${t.type}">${typeLabels[t.type]||'حركة'}</span></td><td>${esc(t.category||'—')}</td><td>${dateText(t.date)}</td><td><span class="${moneyTypeClass(t.type)}">${['income','sale'].includes(t.type)?'+':'−'} ${money(t.amount)}</span></td><td>${esc(t.note||'—')}</td><td><div class="contact-actions"><button class="small-action edit-transaction" data-id="${esc(t.id)}" title="تعديل"><i class="fa-solid fa-pen"></i></button><button class="small-action delete-transaction" data-id="${esc(t.id)}" title="حذف"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join('');
    $('#transactionsEmpty').classList.toggle('hidden',items.length>0);$('#transactionResultsCount').textContent=`${num(items.length)} حركة`;
  }
  function renderInventory() {
    const query=($('#inventorySearch').value||'').trim().toLowerCase(),filter=$('#stockFilter').value;
    const items=state.products.filter(p=>(`${p.name} ${p.sku}`.toLowerCase().includes(query))&&(filter==='all'||Number(p.quantity)<=Number(p.reorder)));
    $('#inventoryTable').innerHTML=items.map(p=>{const low=Number(p.quantity)<=Number(p.reorder);return `<tr><td><div class="transaction-name"><span class="transaction-symbol"><i class="fa-solid fa-box"></i></span>${esc(p.name)}</div></td><td>${esc(p.sku||'—')}</td><td><strong>${num(p.quantity)}</strong></td><td>${money(p.cost)}</td><td><strong>${money(productValue(p))}</strong></td><td><span class="stock-badge" style="background:${low?'#492e1b':'#0b3b35'};color:${low?'#ffc47f':'#47dfbc'}">${low?'مخزون منخفض':'متوفر'}</span></td><td><div class="contact-actions"><button class="small-action edit-product" data-id="${esc(p.id)}" title="تعديل"><i class="fa-solid fa-pen"></i></button><button class="small-action delete-product" data-id="${esc(p.id)}" title="حذف"><i class="fa-solid fa-trash"></i></button></div></td></tr>`;}).join('');
    const value=state.products.reduce((s,p)=>s+productValue(p),0);$('#productsCount').textContent=num(state.products.length);$('#inventoryValue').textContent=money(value);$('#lowStockCount').textContent=num(state.products.filter(p=>Number(p.quantity)<=Number(p.reorder)).length);$('#inventoryEmpty').classList.toggle('hidden',items.length>0);
  }
  function renderContacts() {
    const query=($('#contactsSearch').value||'').trim().toLowerCase(),filter=$('#contactTypeFilter').value;
    const items=state.contacts.filter(c=>(filter==='all'||c.type===filter)&&`${c.name} ${c.phone} ${c.notes}`.toLowerCase().includes(query));
    $('#contactsGrid').innerHTML=items.map(c=>`<div class="contact-card"><div class="contact-avatar">${esc(c.name.slice(0,1))}</div><div class="contact-details"><h4>${esc(c.name)}</h4><p>${esc(c.phone||'لا يوجد رقم هاتف')}</p><span class="type-badge ${c.type==='customer'?'income':'purchase'}">${c.type==='customer'?'عميل':'مورد'}</span><div class="contact-meta"><span>${c.type==='customer'?'مستحقات لك':'مستحقات عليك'}</span><strong>${money(c.balance)}</strong></div></div><div class="contact-actions"><button class="small-action edit-contact" data-id="${esc(c.id)}" title="تعديل"><i class="fa-solid fa-pen"></i></button><button class="small-action delete-contact" data-id="${esc(c.id)}" title="حذف"><i class="fa-solid fa-trash"></i></button></div></div>`).join('');
    $('#customersCount').textContent=num(state.contacts.filter(c=>c.type==='customer').length);$('#suppliersCount').textContent=num(state.contacts.filter(c=>c.type==='supplier').length);$('#receivablesTotal').textContent=money(total(state.contacts,c=>c.type==='customer','balance'));$('#contactsEmpty').classList.toggle('hidden',items.length>0);
  }
  let activeReport='income';
  function renderReport() {
    $('#reportDate').textContent=`تاريخ الإصدار: ${dateText(todayISO())}`;
    const all=state.transactions; const income=revenues(all), expense=expenses(all), profit=income-expense; let html='';
    if(activeReport==='income'){
      $('#reportHeading').textContent='قائمة الدخل';$('#reportSubtitle').textContent='ملخص الإيرادات والمصروفات المسجلة';
      html=`<table class="report-table"><tbody><tr class="section-row"><td colspan="2">الإيرادات</td></tr><tr><td>إيرادات ومبيعات</td><td>${money(income)}</td></tr><tr class="section-row"><td colspan="2">المصروفات والمشتريات</td></tr><tr><td>مصروفات ومشتريات مسجلة</td><td>${money(expense)}</td></tr><tr class="total-row"><td>صافي النتيجة التقديرية</td><td>${money(profit)}</td></tr></tbody></table>`;
    } else if(activeReport==='position'){
      $('#reportHeading').textContent='المركز المالي المبسط';$('#reportSubtitle').textContent='أصول والتزامات تقريبية بحسب المدخلات المتاحة';
      const inventory=state.products.reduce((s,p)=>s+productValue(p),0), receivables=total(state.contacts,c=>c.type==='customer','balance'), payables=total(state.contacts,c=>c.type==='supplier','balance'), cash=profit, assets=Math.max(0,cash)+inventory+receivables, equity=assets-payables;
      html=`<table class="report-table"><tbody><tr class="section-row"><td colspan="2">الأصول</td></tr><tr><td>نقدية تقديرية (صافي الحركات، بافتراض رصيد افتتاحي صفر)</td><td>${money(cash)}</td></tr><tr><td>مخزون بالتكلفة</td><td>${money(inventory)}</td></tr><tr><td>أرصدة العملاء المدخلة يدويًا</td><td>${money(receivables)}</td></tr><tr class="total-row"><td>إجمالي الأصول التقديري</td><td>${money(assets)}</td></tr><tr class="section-row"><td colspan="2">الالتزامات وحقوق الملكية</td></tr><tr><td>أرصدة الموردين المدخلة يدويًا</td><td>${money(payables)}</td></tr><tr><td>حقوق الملكية (فرق حسابي تقريبي)</td><td>${money(equity)}</td></tr><tr class="total-row"><td>الإجمالي</td><td>${money(assets)}</td></tr></tbody></table>`;
    } else {
      $('#reportHeading').textContent='قائمة التدفقات النقدية';$('#reportSubtitle').textContent='تجميع مبسط حسب شهر تسجيل الحركة';
      const byMonth={}; all.forEach(t=>{const key=(t.date||'').slice(0,7)||'غير محدد';if(!byMonth[key])byMonth[key]={income:0,expense:0};if(['income','sale'].includes(t.type))byMonth[key].income+=Number(t.amount)||0;else byMonth[key].expense+=Number(t.amount)||0;});
      const rows=Object.entries(byMonth).sort((a,b)=>b[0].localeCompare(a[0])); html=`<table class="report-table"><thead><tr><th>الشهر</th><th>المقبوضات المسجلة</th><th>المدفوعات المسجلة</th><th>الصافي</th></tr></thead><tbody>${rows.map(([m,x])=>`<tr><td>${esc(m)}</td><td>${money(x.income)}</td><td>${money(x.expense)}</td><td><span class="${x.income-x.expense>=0?'amount-positive':'amount-negative'}">${money(x.income-x.expense)}</span></td></tr>`).join('')||'<tr><td colspan="4">لا توجد حركات مسجلة.</td></tr>'}<tr class="total-row"><td>الإجمالي</td><td>${money(income)}</td><td>${money(expense)}</td><td>${money(profit)}</td></tr></tbody></table>`;
    }
    $('#reportContent').innerHTML=html;
  }

  function answerQuestion(question) {
    const q=question.toLowerCase();const all=state.transactions;const income=revenues(all),expense=expenses(all),profit=income-expense;
    if(/مصروف|نفقات|صرف|تكاليف/.test(q)&&/أكثر|اكبر|الأعلى|اعلى|بند|تستهلك/.test(q)){
      const cats={};all.filter(t=>['expense','purchase'].includes(t.type)).forEach(t=>cats[t.category||'أخرى']=(cats[t.category||'أخرى']||0)+Number(t.amount||0));const top=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,5);return top.length?`أعلى بنود المصروفات حسب الحركات المسجلة:\n${top.map((x,i)=>`${i+1}. ${x[0]}: ${money(x[1])}`).join('\n')}\n\nهذه النتيجة تعتمد على التصنيفات التي تم إدخالها، لذلك راجع القيود غير المصنفة.`:'لا توجد مصروفات مسجلة بعد، أضف الحركات حتى أتمكن من تحليلها.';
    }
    if(/مخزون|نفاد|تنفد|أصناف|اصناف|بضاعة/.test(q)){const low=state.products.filter(p=>Number(p.quantity)<=Number(p.reorder));return low.length?`الأصناف التي وصلت إلى حد إعادة الطلب أو أقل:\n${low.map(p=>`• ${p.name}: المتاح ${num(p.quantity)}، حد إعادة الطلب ${num(p.reorder)}`).join('\n')}\n\nراجع الكميات الفعلية قبل إصدار أمر شراء.`:`لا يوجد صنف عند حد إعادة الطلب أو أقل حسب الكميات الحالية. إجمالي الأصناف: ${state.products.length}.`;}
    if(/تقليل|خفض|توفير|اقتراح|نصيح|النفقات|التكاليف/.test(q)){const cats={};all.filter(t=>['expense','purchase'].includes(t.type)).forEach(t=>cats[t.category||'أخرى']=(cats[t.category||'أخرى']||0)+Number(t.amount||0));const top=Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];let out='اقتراحات عملية مبدئية:\n1. صنّف كل مصروف بدقة وراجع البنود المتكررة شهريًا.\n2. قارن عروض الموردين وراجع الاشتراكات والخدمات غير المستخدمة.\n3. راقب المخزون البطيء لتقليل الأموال المجمّدة في البضاعة.';if(top)out+=`\n4. ابدأ بمراجعة بند «${top[0]}» لأنه الأعلى في السجلات الحالية (${money(top[1])}).`;return out;}
    if(/إيراد|ايراد|مبيعات|دخل|مصروف|ربح|مالي|وضع|إجمالي|اجمالي|التدفق/.test(q)){return `الملخص بحسب كل الحركات المسجلة:\n• إجمالي الإيرادات والمبيعات: ${money(income)}\n• إجمالي المصروفات والمشتريات: ${money(expense)}\n• صافي الفرق التقريبي: ${money(profit)}\n• عدد الحركات: ${num(all.length)}\n\nتنبيه: هذه أرقام مبسطة وقد لا تمثل الربح المحاسبي النهائي؛ تحقق من الضرائب والمخزون والمستحقات والقيود غير المسجلة.`;}
    if(/عميل|عملاء|مورد|موردين|مديون|مستحق/.test(q)){const rec=total(state.contacts,c=>c.type==='customer','balance'),pay=total(state.contacts,c=>c.type==='supplier','balance');return `بحسب أرصدة جهات التعامل المدخلة يدويًا:\n• مستحقات العملاء لك: ${money(rec)}\n• مستحقات الموردين عليك: ${money(pay)}\n• العملاء: ${state.contacts.filter(c=>c.type==='customer').length}، الموردون: ${state.contacts.filter(c=>c.type==='supplier').length}\n\nتأكد من مطابقة هذه الأرصدة مع كشف الحساب الفعلي.`;}
    if(/تاريخ|الخميس|اليوم|مبيعات يوم|مبيعات/.test(q)){const dayMatch=q.match(/(\d{4}-\d{2}-\d{2})/);const target=dayMatch?dayMatch[1]:todayISO();const todayTx=all.filter(t=>t.date===target);return `حركات ${dateText(target)}:\n• الإيرادات والمبيعات: ${money(revenues(todayTx))}\n• المصروفات والمشتريات: ${money(expenses(todayTx))}\n• عدد الحركات: ${todayTx.length}\n\nلو تقصد تاريخًا آخر، اكتب التاريخ بصيغة سنة-شهر-يوم (YYYY-MM-DD).`;}
    return 'أقدر أجيب لك ملخص الإيرادات والمصروفات والربح، وأعلى بنود الإنفاق، والأصناف منخفضة المخزون، وأرصدة العملاء والموردين. جرّب اختيار أحد الأسئلة المقترحة. هذه النسخة تستخدم قواعد بسيطة وليست نموذج ذكاء اصطناعي متصلًا بالإنترنت.';
  }
  function appendChat(text, who='assistant') { const wrapper=document.createElement('div');wrapper.className=`chat-message ${who}`; const avatar=document.createElement('div');avatar.className='message-avatar';avatar.innerHTML=who==='user'?'<i class="fa-solid fa-user"></i>':'<i class="fa-solid fa-robot"></i>';const bubble=document.createElement('div');bubble.className='message-bubble';const p=document.createElement('p');p.textContent=text;bubble.append(p);wrapper.append(avatar,bubble);$('#chatMessages').append(wrapper);$('#chatMessages').scrollTop=$('#chatMessages').scrollHeight; }
  function sendChat(text) {const question=(text||'').trim();if(!question)return;appendChat(question,'user');$('#chatInput').value='';setTimeout(()=>appendChat(answerQuestion(question),'assistant'),180);}

  function downloadFile(filename, content, mime='text/plain;charset=utf-8') { const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800); }
  function exportCsv() {const rows=[['التاريخ','النوع','الوصف','التصنيف','المبلغ','الضريبة %','العميل / المورد','ملاحظات'],...state.transactions.map(t=>[t.date,typeLabels[t.type]||t.type,t.description,t.category,t.amount,t.tax,t.contact,t.note])];const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');downloadFile(`mizan-transactions-${todayISO()}.csv`,csv,'text/csv;charset=utf-8');toast('تم تجهيز ملف CSV للتنزيل.');}
  function backup() {downloadFile(`mizan-backup-${todayISO()}.json`,JSON.stringify({version:2,exportedAt:new Date().toISOString(),...state},null,2),'application/json');toast('تم تنزيل النسخة الاحتياطية.');}
  function loadDemo() {if(!confirm('سيتم استبدال البيانات الحالية ببيانات تجريبية. هل تريد المتابعة؟'))return;const demo=makeDemoData();state.transactions=demo.transactions;state.products=demo.products;state.contacts=demo.contacts;state.journals=[];state.documents=[];state.assets=[];state.projects=[];state.bankItems=[];state.auditLog=[];save();renderAll();toast('تمت استعادة البيانات التجريبية.');}
  function clearAll() {if(!confirm('هل أنت متأكد؟ سيتم حذف كل الحركات والأصناف والعملاء والموردين المحفوظين على هذا المتصفح.'))return;state.transactions=[];state.products=[];state.contacts=[];state.journals=[];state.documents=[];state.assets=[];state.projects=[];state.bankItems=[];state.auditLog=[];save();renderAll();toast('تم مسح البيانات.');}

  function renderERP() {
    const journals=state.journals||[], docs=state.documents||[], assets=state.assets||[], projects=state.projects||[], bank=state.bankItems||[];
    $('#erpJournalCount').textContent=num(journals.length);
    $('#erpPendingDocs').textContent=num(docs.filter(d=>d.status!=='posted').length);
    $('#erpMonthlyDep').textContent=money(assets.reduce((sum,a)=>sum+assetDepreciationMonthly(a),0));
    $('#erpJournalsTable').innerHTML=[...journals].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(j=>`<tr><td>${dateText(j.date)}</td><td>${esc(j.description)}</td><td>${esc(j.debitAccount)}</td><td>${esc(j.creditAccount)}</td><td>${esc(j.costCenter||'—')}</td><td><strong>${money(j.amount)}</strong></td></tr>`).join('');
    $('#erpJournalsEmpty').classList.toggle('hidden',journals.length>0);
    const accountTotals={};
    journals.forEach(j=>{
      const debit=Number(j.amount)||0, credit=Number(j.amount)||0;
      if(!accountTotals[j.debitAccount])accountTotals[j.debitAccount]={debit:0,credit:0};
      if(!accountTotals[j.creditAccount])accountTotals[j.creditAccount]={debit:0,credit:0};
      accountTotals[j.debitAccount].debit+=debit; accountTotals[j.creditAccount].credit+=credit;
    });
    const accountRows=Object.entries(accountTotals).sort((a,b)=>a[0].localeCompare(b[0]));
    $('#erpTrialBalanceTable').innerHTML=accountRows.map(([account,x])=>{const net=x.debit-x.credit;return `<tr><td><strong>${esc(account)}</strong></td><td>${money(x.debit)}</td><td>${money(x.credit)}</td><td>${money(Math.max(0,net))}</td><td>${money(Math.max(0,-net))}</td></tr>`;}).join('')+(accountRows.length?`<tr class="total-row"><td>الإجمالي</td><td>${money(journals.reduce((n,j)=>n+(Number(j.amount)||0),0))}</td><td>${money(journals.reduce((n,j)=>n+(Number(j.amount)||0),0))}</td><td>${money(accountRows.reduce((n,[,x])=>n+Math.max(0,x.debit-x.credit),0))}</td><td>${money(accountRows.reduce((n,[,x])=>n+Math.max(0,x.credit-x.debit),0))}</td></tr>`:'');
    $('#erpTrialBalanceEmpty').classList.toggle('hidden',accountRows.length>0);
    $('#erpDocumentsTable').innerHTML=[...docs].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(d=>{
      let actions = `<span class="erp-status ${esc(d.status)}">${docStatusLabels[d.status]||'مسودة'}</span>`;
      if(d.status==='draft') actions += ` <button class="small-action approve-document" data-id="${esc(d.id)}" title="اعتماد الفاتورة"><i class="fa-solid fa-check"></i></button>`;
      if(d.status==='approved') actions += ` <button class="small-action post-document" data-id="${esc(d.id)}" title="ترحيل إلى المعاملات"><i class="fa-solid fa-arrow-right-to-bracket"></i></button>`;
      return `<tr><td><strong>${esc(d.number)}</strong></td><td>${docTypeLabels[d.type]||'—'}</td><td>${esc(d.contact)}</td><td>${dateText(d.date)}</td><td>${money(d.subtotal)}</td><td>${money(d.taxAmount||0)}</td><td><strong>${money(d.total||d.subtotal)}</strong></td><td><div class="erp-doc-actions">${actions}</div></td></tr>`;
    }).join('');
    $('#erpDocumentsEmpty').classList.toggle('hidden',docs.length>0);
    $('#erpAssetsTable').innerHTML=[...assets].sort((a,b)=>(a.name||'').localeCompare(b.name||'')).map(a=>{
      const monthly=assetDepreciationMonthly(a), months=Math.min(monthsBetween(a.date),Math.max(1,Number(a.lifeYears)||1)*12), book=Math.max(Number(a.residual)||0,Number(a.cost)-monthly*months);
      return `<tr><td><strong>${esc(a.name)}</strong><small class="table-subline">${dateText(a.date)} · ${esc(a.costCenter||'بدون مركز تكلفة')}</small></td><td>${money(a.cost)}</td><td>${money(monthly)}</td><td><strong>${money(book)}</strong></td></tr>`;
    }).join('');
    $('#erpAssetsEmpty').classList.toggle('hidden',assets.length>0);
    $('#erpProjectsTable').innerHTML=[...projects].map(x=>{const variance=Number(x.budget)-Number(x.actualCost);return `<tr><td><strong>${esc(x.name)}</strong><small class="table-subline">${esc(x.customer||'')} · ${esc(({active:'قائم','on-hold':'متوقف مؤقتًا',closed:'مغلق'})[x.status]||'قائم')}</small></td><td>${projectTypeLabels[x.type]||'مشروع'}</td><td>${money(x.budget)}</td><td>${money(x.actualCost)}</td><td><span class="${variance>=0?'amount-positive':'amount-negative'}">${money(variance)}</span></td></tr>`;}).join('');
    $('#erpProjectsEmpty').classList.toggle('hidden',projects.length>0);
    $('#erpBankTable').innerHTML=[...bank].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(b=>`<tr><td>${dateText(b.date)}</td><td>${esc(b.description)}</td><td>${esc(b.reference||'—')}</td><td>${b.direction==='in'?'وارد':'صادر'}</td><td><strong class="${b.direction==='in'?'amount-positive':'amount-negative'}">${b.direction==='in'?'+':'−'} ${money(b.amount)}</strong></td><td><span class="erp-status ${b.reconciled?'posted':'draft'}">${b.reconciled?'تمت المطابقة':'غير مطابق'}</span></td><td><button class="small-action toggle-bank-match" data-id="${esc(b.id)}" title="تغيير حالة المطابقة"><i class="fa-solid ${b.reconciled?'fa-rotate-left':'fa-check'}"></i></button></td></tr>`).join('');
    $('#erpBankEmpty').classList.toggle('hidden',bank.length>0);
    $('#erpAuditLog').innerHTML=(state.auditLog||[]).slice(0,8).map(a=>`<div class="erp-audit-row"><span class="erp-audit-dot"></span><div><strong>${esc(a.action)}</strong><small>${esc(a.detail||'')}</small></div><time>${esc(new Intl.DateTimeFormat('ar-EG',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'}).format(new Date(a.at)))}</time></div>`).join('') || '<p class="muted-empty">لا توجد أنشطة ERP بعد.</p>';
  }

  function renderAll() {renderDashboard();renderTransactions();renderInventory();renderContacts();renderReport();renderERP();$('#sidebarBusinessName').textContent=state.settings.businessName||'مشروعي التجاري';$('#businessName').value=state.settings.businessName||'';$('#ownerName').value=state.settings.ownerName||'';$('#currency').value=state.settings.currency||'EGP';$('#taxRate').value=state.settings.taxRate??14;$('#transactionCount').textContent=state.transactions.length;}

  // Navigation and delegated row actions.
  $$('.nav-link[data-page]').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.page)));
  $$('[data-goto]').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.goto)));
  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#quickAdd').addEventListener('click',()=>openModal('transaction'));
  $('#addTransaction').addEventListener('click',()=>openModal('transaction'));
  $('#addProduct').addEventListener('click',()=>openModal('product'));
  $('#addContact').addEventListener('click',()=>openModal('contact'));
  $('#addJournal').addEventListener('click',()=>openModal('journal'));
  $('#addSalesDocument').addEventListener('click',()=>openModal('salesdoc'));
  $('#addPurchaseDocument').addEventListener('click',()=>openModal('purchasedoc'));
  $('#addAsset').addEventListener('click',()=>openModal('asset'));
  $('#addProject').addEventListener('click',()=>openModal('project'));
  $('#addBankItem').addEventListener('click',()=>openModal('bank'));
  $('#closeModal').addEventListener('click',closeModal);$('#cancelModal').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});$('#modalForm').addEventListener('submit',saveModal);
  $('#dashboardPeriod').addEventListener('change',renderDashboard);
  ['transactionSearch','transactionTypeFilter','transactionPeriodFilter'].forEach(s=>$('#'+s).addEventListener(s.includes('Search')?'input':'change',renderTransactions));
  ['inventorySearch','stockFilter'].forEach(s=>$('#'+s).addEventListener(s==='inventorySearch'?'input':'change',renderInventory));
  ['contactsSearch','contactTypeFilter'].forEach(s=>$('#'+s).addEventListener(s==='contactsSearch'?'input':'change',renderContacts));
  $('#transactionsTable').addEventListener('click',e=>{const edit=e.target.closest('.edit-transaction'),del=e.target.closest('.delete-transaction');if(edit){const item=state.transactions.find(t=>t.id===edit.dataset.id);if(item)openModal('transaction',item);}if(del){const item=state.transactions.find(t=>t.id===del.dataset.id);if(item&&confirm(`حذف الحركة «${item.description}»؟`)){state.transactions=state.transactions.filter(t=>t.id!==item.id);logAudit('حذف حركة',item.description);save();renderAll();toast('تم حذف الحركة.');}}});
  $('#inventoryTable').addEventListener('click',e=>{const edit=e.target.closest('.edit-product'),del=e.target.closest('.delete-product');if(edit){const item=state.products.find(p=>p.id===edit.dataset.id);if(item)openModal('product',item);}if(del){const item=state.products.find(p=>p.id===del.dataset.id);if(item&&confirm(`حذف الصنف «${item.name}»؟`)){state.products=state.products.filter(p=>p.id!==item.id);logAudit('حذف صنف',item.name);save();renderAll();toast('تم حذف الصنف.');}}});
  $('#contactsGrid').addEventListener('click',e=>{const edit=e.target.closest('.edit-contact'),del=e.target.closest('.delete-contact');if(edit){const item=state.contacts.find(c=>c.id===edit.dataset.id);if(item)openModal('contact',item);}if(del){const item=state.contacts.find(c=>c.id===del.dataset.id);if(item&&confirm(`حذف جهة التعامل «${item.name}»؟`)){state.contacts=state.contacts.filter(c=>c.id!==item.id);logAudit('حذف جهة تعامل',item.name);save();renderAll();toast('تم حذف جهة التعامل.');}}});
  $('#erpDocumentsTable').addEventListener('click',e=>{
    const approve=e.target.closest('.approve-document'), post=e.target.closest('.post-document');
    if(approve){const doc=state.documents.find(d=>d.id===approve.dataset.id);if(!doc||doc.status!=='draft')return;doc.status='approved';logAudit('اعتماد فاتورة',doc.number);save();renderAll();toast(`تم اعتماد الفاتورة ${doc.number}.`);}
    if(post){const doc=state.documents.find(d=>d.id===post.dataset.id);if(!doc||doc.status!=='approved')return;if(!confirm(`ترحيل الفاتورة ${doc.number} إلى المعاملات المالية؟`))return;
      const tx={id:id(),date:doc.date,type:doc.type,category:doc.type==='sale'?'مبيعات':'مشتريات بضاعة',description:doc.description,amount:Number(doc.subtotal),tax:Number(doc.taxRate)||0,contact:doc.contact,note:`فاتورة ${doc.number} مرحّلة من مركز ERP`};
      state.transactions.unshift(tx);
      const isSale=doc.type==='sale'; const supplierOrCustomerAccount=isSale?'العملاء':'الموردون';
      const baseJournal={id:id(),date:doc.date,description:`${isSale?'إثبات مبيعات':'إثبات مشتريات'} فاتورة ${doc.number}`,debitAccount:isSale?supplierOrCustomerAccount:'المشتريات',creditAccount:isSale?'الإيرادات':supplierOrCustomerAccount,amount:Number(doc.subtotal),costCenter:doc.costCenter||'',reference:doc.number,debit:Number(doc.subtotal),credit:Number(doc.subtotal),sourceDocumentId:doc.id};
      state.journals.unshift(baseJournal); doc.journalIds=[baseJournal.id];
      const taxAmount=Math.round(Number(doc.subtotal)*Number(doc.taxRate))/100;
      if(taxAmount>0){const taxJournal={id:id(),date:doc.date,description:`ضريبة فاتورة ${doc.number}`,debitAccount:isSale?'العملاء':'ضريبة القيمة المضافة - مدخلات',creditAccount:isSale?'ضريبة القيمة المضافة':'الموردون',amount:taxAmount,costCenter:doc.costCenter||'',reference:doc.number,debit:taxAmount,credit:taxAmount,sourceDocumentId:doc.id};state.journals.unshift(taxJournal);doc.journalIds.push(taxJournal.id);}
      doc.status='posted';doc.transactionId=tx.id;doc.postedAt=new Date().toISOString();logAudit('ترحيل فاتورة',`${doc.number} — ${money(doc.total)}`);save();renderAll();toast('تم ترحيل الفاتورة وإنشاء قيود مبسطة مرتبطة بها.');
    }
  });
  $('#erpBankTable').addEventListener('click',e=>{const btn=e.target.closest('.toggle-bank-match');if(!btn)return;const item=state.bankItems.find(b=>b.id===btn.dataset.id);if(!item)return;item.reconciled=!item.reconciled;logAudit(item.reconciled?'مطابقة حركة بنكية':'إلغاء مطابقة حركة بنكية',item.description);save();renderERP();toast(item.reconciled?'تم وضع علامة المطابقة اليدوية.':'تم إلغاء علامة المطابقة.');});
  $('#exportErpData').addEventListener('click',()=>{downloadFile(`mizan-erp-data-${todayISO()}.json`,JSON.stringify({exportedAt:new Date().toISOString(),business:state.settings.businessName,journals:state.journals,documents:state.documents,assets:state.assets,projects:state.projects,bankItems:state.bankItems,auditLog:state.auditLog},null,2),'application/json');toast('تم تصدير سجلات ERP إلى JSON.');});
  $('#exportEInvoices').addEventListener('click',()=>{const posted=state.documents.filter(d=>d.status==='posted');if(!posted.length){toast('لا توجد فواتير مرحلة للتصدير.',true);return;}const payload={exportPurpose:'integration-preparation-only',notice:'This file is not an official Egyptian Tax Authority e-invoice submission or approval.',businessName:state.settings.businessName,currency:state.settings.currency,generatedAt:new Date().toISOString(),invoices:posted.map(d=>({invoiceNumber:d.number,invoiceType:d.type==='sale'?'sales':'purchase',issueDate:d.date,partyName:d.contact,description:d.description,subtotal:Number(d.subtotal),taxRate:Number(d.taxRate),taxAmount:Number(d.taxAmount),total:Number(d.total),costCenter:d.costCenter||'',status:d.status}))};downloadFile(`mizan-invoices-integration-${todayISO()}.json`,JSON.stringify(payload,null,2),'application/json');toast('تم تصدير بيانات الفواتير؛ لم يتم إرسالها أو اعتمادها ضريبيًا.');});

  $$('.report-tab').forEach(btn=>btn.addEventListener('click',()=>{$$('.report-tab').forEach(b=>b.classList.toggle('active',b===btn));activeReport=btn.dataset.report;renderReport();}));
  $('#printReport').addEventListener('click',()=>window.print());
  $('#exportDashboard').addEventListener('click',exportCsv);$('#exportTransactions').addEventListener('click',exportCsv);$('#backupData').addEventListener('click',backup);$('#loadDemo').addEventListener('click',loadDemo);$('#clearAllData').addEventListener('click',clearAll);
  $('#settingsForm').addEventListener('submit',e=>{e.preventDefault();state.settings={...state.settings,businessName:$('#businessName').value.trim()||'مشروعي التجاري',ownerName:$('#ownerName').value.trim(),currency:$('#currency').value,taxRate:Math.max(0,Math.min(100,Number($('#taxRate').value)||0))};save();renderAll();toast('تم حفظ إعدادات النشاط.');});$('#saveSettingsTop').addEventListener('click',()=>$('#settingsForm').requestSubmit());
  $('#restoreData').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!data||!Array.isArray(data.transactions)||!Array.isArray(data.products)||!Array.isArray(data.contacts)||!data.settings)throw new Error('invalid');if(!confirm('ستُستبدل البيانات الحالية بمحتوى النسخة المحددة. هل تريد المتابعة؟'))return;state={...state,transactions:data.transactions,products:data.products,contacts:data.contacts,journals:Array.isArray(data.journals)?data.journals:[],documents:Array.isArray(data.documents)?data.documents:[],assets:Array.isArray(data.assets)?data.assets:[],projects:Array.isArray(data.projects)?data.projects:[],bankItems:Array.isArray(data.bankItems)?data.bankItems:[],auditLog:Array.isArray(data.auditLog)?data.auditLog:[],settings:{...state.settings,...data.settings}};save();renderAll();toast('تمت استعادة النسخة الاحتياطية.');}catch{toast('الملف غير صالح أو ليس نسخة ميزان الاحتياطية.',true);}finally{e.target.value='';}});
  $('#profileButton').addEventListener('click',()=>toast(`النشاط الحالي: ${state.settings.businessName}. هذه نسخة محلية تجريبية.`));
  $('#helpButton').addEventListener('click',()=>toast('استخدم القائمة للتنقل، وأضف الحركات من زر «إضافة حركة». البيانات تُحفظ على نفس المتصفح.'));
  $('#notificationsButton').addEventListener('click',()=>{const low=state.products.filter(p=>Number(p.quantity)<=Number(p.reorder));toast(low.length?`تنبيه: ${low.length} صنف منخفض المخزون (${low.slice(0,3).map(p=>p.name).join('، ')}).`:'لا توجد تنبيهات مخزون حالية.');});

  // Assistant interaction.
  $('#chatForm').addEventListener('submit',e=>{e.preventDefault();sendChat($('#chatInput').value);});
  $$('.suggested-questions button').forEach(btn=>btn.addEventListener('click',()=>sendChat(btn.dataset.question)));
  $('#clearChat').addEventListener('click',()=>{$('#chatMessages').innerHTML='';appendChat('تم بدء محادثة جديدة. اسأل عن الأرقام المسجلة أو المخزون.');});
  $('#voiceButton').addEventListener('click',()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('التعرف الصوتي غير مدعوم في هذا المتصفح. جرّب Chrome مع السماح بالميكروفون.',true);return;}const rec=new SR();rec.lang='ar-EG';rec.interimResults=false;rec.maxAlternatives=1;rec.onresult=e=>{$('#chatInput').value=e.results[0][0].transcript;$('#chatInput').focus();};rec.onerror=()=>toast('لم نتمكن من التقاط الصوت. تحقق من صلاحية الميكروفون.',true);rec.start();});

  // Invoice OCR. Recognition is performed in the browser via Tesseract.js; the result must be reviewed.
  $('#invoiceImage').addEventListener('change',e=>{selectedInvoiceFile=e.target.files?.[0]||null;$('#runOcr').disabled=!selectedInvoiceFile;if(selectedInvoiceFile){const url=URL.createObjectURL(selectedInvoiceFile);$('#invoicePreview').src=url;$('#ocrResult').classList.remove('hidden');$('#ocrText').textContent='جاهز لمحاولة القراءة.';$('#ocrStatus').textContent=`الصورة المختارة: ${selectedInvoiceFile.name}. اضغط «قراءة الفاتورة» لبدء المحاولة.`;extractedOcr='';}});
  $('#runOcr').addEventListener('click',async()=>{if(!selectedInvoiceFile)return;if(!window.Tesseract){$('#ocrStatus').textContent='مكتبة القراءة غير متاحة. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة.';return;}$('#runOcr').disabled=true;$('#ocrStatus').textContent='جارٍ قراءة الصورة... قد تستغرق العملية وقتًا حسب حجم الصورة واتصال الإنترنت.';try{const result=await Tesseract.recognize(selectedInvoiceFile,'ara+eng',{logger:m=>{if(m.status==='recognizing text')$('#ocrStatus').textContent=`جارٍ تحليل النص: ${Math.round((m.progress||0)*100)}%`;}});extractedOcr=result.data.text||'';$('#ocrText').textContent=extractedOcr||'لم يتم التعرف على نص واضح.';$('#ocrStatus').textContent=extractedOcr?'انتهت المحاولة. راجع النص المستخرج؛ لا تحفظ أي مبلغ قبل مراجعته.':'لم يتم العثور على نص واضح. جرّب صورة أوضح وإضاءة أفضل.';}catch(err){console.error(err);$('#ocrStatus').textContent='حدث خطأ أثناء قراءة الفاتورة. جرّب صورة أخرى أو تحقق من اتصال الإنترنت.';}finally{$('#runOcr').disabled=!selectedInvoiceFile;}});
  $('#useOcrData').addEventListener('click',()=>{let amount='';const text=extractedOcr;const patterns=[/(?:الإجمالي|الاجمالي|المجموع|total|grand\s*total|net\s*amount)[^\d]{0,25}([\d,٬.]{2,})/i,/(?:جنيه|EGP|LE|ج\.م)[^\d]{0,10}([\d,٬.]{2,})/i];for(const re of patterns){const m=text.match(re);if(m){amount=m[1].replace(/[٬,]/g,'').replace(/\.(?=.*\.)/g,'');if(Number.isFinite(Number(amount))&&Number(amount)>0)break;amount='';}}const defaults={type:'purchase',category:'مشتريات بضاعة',description:'فاتورة مشتريات (راجع البيانات المستخرجة)',note:text.slice(0,600),contact:'',date:todayISO()};if(amount)defaults.amount=Number(amount);else toast('لم أستطع تحديد الإجمالي بثقة؛ اكتب المبلغ يدويًا بعد مراجعة الفاتورة.',true);openModal('transaction',null,defaults);});

  // Keep canvas crisp on resize.
  window.addEventListener('resize',()=>requestAnimationFrame(drawChart));
  $('#todayLabel').textContent=new Intl.DateTimeFormat('ar-EG',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date());$('#yearLabel').textContent=new Date().getFullYear();
  readSaved();renderAll();
})();
