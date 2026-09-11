(() => {
  "use strict";

  const D = window.NAB_DATA;
  const root = document.querySelector("#app-root");
  const device = document.querySelector("#duo-device");
  const deviceWrap = document.querySelector(".device-wrap");
  const live = document.querySelector("#live-region");
  const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });
  const ROTATIONS = [0, 90, 180, 260, 270];
  const savedRotation = Number(localStorage.getItem("nab-rotation"));

  const state = {
    route: "signin",
    stack: [],
    splitRoutes: { primary: "home", secondary: "home" },
    splitStacks: { primary: [], secondary: [] },
    activePane: "primary",
    device: localStorage.getItem("nab-device") || "closed",
    rotation: ROTATIONS.includes(savedRotation) ? savedRotation : 0,
    theme: localStorage.getItem("nab-theme-v2") || "light",
    selectedTransaction: "starbucks",
    selectedRecipient: "maya",
    selectedPayee: "power",
    selectedHolding: "xeqt",
    transferAmount: "250.00",
    billAmount: "118.47",
    cardPayment: "1112.84",
    orderAmount: "500.00",
    orderSide: "Buy",
    cardLocked: false,
    debitLocked: false,
    chartRange: "1M",
    search: "",
    noticeRead: new Set(),
    toggles: { online: true, international: false, cardAlerts: true, debitAlerts: true, fingerprint: true, twofactor: true },
    modal: null
  };

  const paths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
    accounts: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h18M7 15h4"/>',
    payments: '<path d="M7 19V5M3.5 8.5 7 5l3.5 3.5"/><path d="M17 5v14m-3.5-3.5L17 19l3.5-3.5"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h3"/>',
    chart: '<path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/>',
    more: '<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2m0 15v2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M2.5 12h2m15 0h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20.3 15.2A8.4 8.4 0 0 1 8.8 3.7a8.5 8.5 0 1 0 11.5 11.5Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    wallet: '<path d="M4 7h15a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h11v4"/><path d="M16 12h5"/>',
    vault: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><path d="M12 8v4l3 2"/>',
    send: '<path d="m21 3-7 18-4-7-7-4 18-7Z"/><path d="m10 14 4-4"/>',
    request: '<path d="M12 3v18m-5-5 5 5 5-5M7 8l5-5 5 5"/>',
    transfer: '<path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/>',
    bill: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    deposit: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M12 8v8m-3-3 3 3 3-3"/>',
    coffee: '<path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2M8 3v2m4-2v2"/>',
    building: '<path d="M4 21V8l8-5 8 5v13M2 21h20M8 11h2m4 0h2m-8 4h2m4 0h2"/>',
    bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7V2Z"/>',
    "arrow-down": '<path d="M12 3v18m-6-6 6 6 6-6"/>',
    car: '<path d="m5 11 2-5h10l2 5M3 12h18v6H3v-6Z"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4m8-4v4M3 10h18"/>',
    shield: '<path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="3"/><path d="M11 18h2"/>',
    wifi: '<path d="M4 9a12 12 0 0 1 16 0M7 13a7 7 0 0 1 10 0M10 17a3 3 0 0 1 4 0"/><circle cx="12" cy="20" r="1"/>',
    fingerprint: '<path d="M3 12a9 9 0 0 1 15.4-6.4M21 12a9 9 0 0 0-.8-3.7"/><path d="M6 15v-3a6 6 0 0 1 12 0v2.5"/><path d="M9 15v-3a3 3 0 0 1 6 0v3c0 2.4-.5 4.5-1.5 6"/><path d="M6.2 18c.2 1 .5 2 .9 2.8M11.5 15c0 2.6-.4 4.6-1.2 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.8-1.9.9-1.9-2.1-2.1-1.9.9-1.9-.8-.7-2h-3l-.7 2-1.9.8-1.9-.9L.9 7l.9 1.9-.8 1.9-2 .7v3l2 .7.8 1.9-.9 1.9L3 21.1l1.9-.9 1.9.8.7 2h3l.7-2 1.9-.8 1.9.9 2.1-2.1-.9-1.9.8-1.9 2-.7Z" transform="scale(.82) translate(2.6 2.6)"/>',
    document: '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h5M9 13h6m-6 4h6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-1.2.6-1.2 1.3-1.2 2.3M12 17h.01"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    eye: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    chat: '<path d="M4 4h16v13H8l-4 4V4Z"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>'
  };

  function icon(name, label = "") {
    const p = paths[name] || paths.more;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${p}</svg>`;
  }

  const fmt = n => currency.format(n);
  const accountTotal = D.accounts.reduce((sum, a) => sum + a.balance, 0);
  const txById = id => D.transactions.find(t => t.id === id) || D.transactions[0];
  const holdingById = id => D.holdings.find(h => h.id === id) || D.holdings[0];
  const recipientById = id => D.recipients.find(r => r.id === id) || D.recipients[0];
  const payeeById = id => D.payees.find(p => p.id === id) || D.payees[0];

  function announce(message) { live.textContent = ""; requestAnimationFrame(() => { live.textContent = message; }); }
  function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
  function routeBaseFor(route) {
    if (/^(account|transaction|accounts)/.test(route)) return "accounts";
    if (/^(payments|interac|contacts|transfer|bills)/.test(route)) return "payments";
    if (/^(card|cards|debit)/.test(route)) return "cards";
    if (/^(investment|holding|order)/.test(route)) return "investments";
    if (route === "home") return "home";
    return "more";
  }
  function routeBase() { return routeBaseFor(state.route); }
  function isAuthRoute(route = state.route) { return ["signin","fingerprint","otp","forgot"].includes(route); }
  function navigate(route, replace = false) {
    if (!replace && state.route !== route) state.stack.push(state.route);
    state.route = route;
    state.modal = null;
    render();
    announce(`Opened ${titleFor(route)}`);
  }
  function goBack() {
    if (state.modal) { state.modal = null; render(); return; }
    const previous = state.stack.pop();
    if (previous) navigate(previous, true);
  }
  function navigatePane(pane, route, replace = false) {
    const current = state.splitRoutes[pane];
    if (!replace && current !== route) state.splitStacks[pane].push(current);
    state.splitRoutes[pane] = route;
    state.activePane = pane;
    state.modal = null;
    render();
    announce(`Opened ${titleFor(route)} on the ${pane === "primary" ? "primary" : "secondary"} display`);
  }
  function goBackPane(pane) {
    if (state.modal) { state.modal = null; render(); return; }
    const previous = state.splitStacks[pane].pop();
    if (previous) navigatePane(pane, previous, true);
  }
  function paneForTarget(target) {
    if (state.device !== "split" || isAuthRoute()) return null;
    return target.closest("[data-split-pane]")?.dataset.splitPane || null;
  }
  function withRoute(route, renderer) {
    const current = state.route;
    state.route = route;
    try { return renderer(); }
    finally { state.route = current; }
  }
  function titleFor(route) {
    const map = { signin:"Sign in", fingerprint:"Touch ID", home:"Home", accounts:"Accounts", payments:"Payments", interac:"Interac e-Transfer", transfer:"Transfer", bills:"Bills", cards:"Cards", card:"Mastercard", debit:"Debit card", investments:"Investments", spending:"Spending and insights", search:"Search", notifications:"Notifications", profile:"Profile", security:"Security", settings:"Settings", documents:"Documents", help:"Help Center", states:"System states", more:"More" };
    return map[route] || route.split("/").pop().replace(/-/g," ");
  }

  function topbar(title, opts = {}) {
    return `<div class="topbar">
      <div>${opts.eyebrow ? `<p class="eyebrow">${opts.eyebrow}</p>` : ""}<h1>${title}</h1></div>
      <div class="topbar-actions">
        ${opts.search !== false ? `<button class="icon-button" data-route="search" aria-label="Search">${icon("search")}</button>` : ""}
        ${opts.notify ? `<button class="icon-button" data-route="notifications" aria-label="Notifications">${icon("bell")}</button>` : ""}
        ${opts.add ? `<button class="icon-button" data-route="${opts.add}" aria-label="Add">${icon("plus")}</button>` : ""}
      </div>
    </div>`;
  }

  function rowIcon(name, tone = "") { return `<span class="row-icon ${tone}">${icon(name)}</span>`; }
  function transactionRows(items = D.transactions) {
    return `<div class="list">${items.map(t => `<button class="list-row chevron" data-transaction="${t.id}">
      ${rowIcon(t.icon, t.amount > 0 ? "success" : "")}
      <span class="row-copy"><strong>${t.merchant}</strong><small>${t.meta}</small></span>
      <span class="row-value"><strong class="${t.amount > 0 ? "positive" : "negative"}">${t.amount > 0 ? "+" : ""}${fmt(t.amount)}</strong><small>${t.status}</small></span>
    </button>`).join("")}</div>`;
  }
  function accountRows() {
    return `<div class="account-list">${D.accounts.map(a => `<button class="list-row chevron" data-route="${a.id === "chequing" || a.id === "savings" ? `account/${a.id}` : a.id === "mastercard" ? "card" : "investments"}">
      ${rowIcon(a.icon, a.tone)}<span class="row-copy"><strong>${a.name}</strong><small>${a.number}</small></span>
      <span class="row-value"><strong>${fmt(Math.abs(a.balance))}</strong><small>${a.balance < 0 ? "Current balance" : "Available"}</small></span>
    </button>`).join("")}</div>`;
  }
  function chartMarkup() {
    return `<div class="chart" aria-label="Portfolio performance chart, up 8.4 percent">
      <svg viewBox="0 0 500 130" preserveAspectRatio="none"><defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2563eb" stop-opacity=".26"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0 108 C35 102,55 112,85 94 S140 88,172 72 S225 84,255 58 S320 70,354 43 S420 53,500 20 L500 130 L0 130Z"/><path class="line" d="M0 108 C35 102,55 112,85 94 S140 88,172 72 S225 84,255 58 S320 70,354 43 S420 53,500 20"/><circle class="chart-dot" cx="500" cy="20" r="5"/></svg>
    </div>`;
  }
  function rangeTabs() { return `<div class="range-tabs" role="tablist" aria-label="Chart range">${["1D","1W","1M","3M","1Y","ALL"].map(r=>`<button role="tab" aria-selected="${state.chartRange===r}" class="${state.chartRange===r?"is-active":""}" data-range="${r}">${r}</button>`).join("")}</div>`; }

  function homeView() {
    return `<section class="screen"><div class="screen-inner">
      ${topbar("Welcome back, Alex", {eyebrow:"Thursday, September 20",notify:true})}
      <div class="grid home-grid">
        <div>
          <article class="balance-hero"><small>Total financial position</small><strong class="amount">${fmt(accountTotal)}</strong><div class="balance-meta"><span>Cash<b>${fmt(17307.17)}</b></span><span>Investments<b>${fmt(17842.36)}</b></span><span>Credit<b>−${fmt(1286.34)}</b></span></div></article>
          <div class="section-title"><h2>Quick actions</h2></div>
          <div class="quick-actions">
            ${[["send","Send","interac/recipient"],["request","Request","interac/request"],["transfer","Transfer","transfer"],["bill","Pay bill","bills/payee"],["deposit","Deposit","deposit"]].map(([i,l,r])=>`<button class="quick-action" data-route="${r}"><span class="quick-icon">${icon(i)}</span><span>${l}</span></button>`).join("")}
          </div>
          <div class="section-title"><h2>Accounts</h2><button class="text-button" data-route="accounts">View all</button></div>
          <article class="card">${accountRows()}</article>
        </div>
        <div>
          <div class="section-title"><h2>Recent activity</h2><button class="text-button" data-route="account/chequing">See all</button></div>
          <article class="card">${transactionRows(D.transactions.slice(0,4))}</article>
          <div class="section-title"><h2>Coming up</h2></div>
          <article class="card">
            <button class="list-row chevron" data-route="bills">${rowIcon("calendar")}<span class="row-copy"><strong>Eastlink Mobile</strong><small>Scheduled tomorrow</small></span><span class="row-value"><strong>$86.40</strong><small>Bill</small></span></button>
            <button class="list-row chevron" data-route="card">${rowIcon("card","navy")}<span class="row-copy"><strong>Mastercard payment</strong><small>Due September 24</small></span><span class="row-value"><strong>$45.00</strong><small>Minimum</small></span></button>
          </article>
          <div class="section-title"><h2>Insight</h2></div>
          <button class="card elevated list-row chevron" data-route="spending">${rowIcon("chart","teal")}<span class="row-copy"><strong>You saved 18% this month</strong><small>That’s $214 more than August.</small></span></button>
        </div>
      </div>
    </div></section>`;
  }

  function accountsView() {
    return `<section class="screen"><div class="screen-inner">${topbar("Accounts",{notify:true})}
      <article class="balance-hero"><small>Total across banking and investments</small><strong>${fmt(accountTotal)}</strong><div class="balance-meta"><span>Cash available<b>${fmt(17307.17)}</b></span><span>Credit available<b>${fmt(D.card.available)}</b></span></div></article>
      <div class="section-title"><h2>Your accounts</h2></div><article class="card">${accountRows()}</article>
      <div class="section-title"><h2>Monthly cash flow</h2></div><article class="card"><div class="metric-grid"><div class="metric"><small>Income</small><strong class="positive">+${fmt(3842.20)}</strong></div><div class="metric"><small>Spending</small><strong>${fmt(3546.18)}</strong></div></div>${chartMarkup()}</article>
    </div></section>`;
  }

  function accountView(id = "chequing") {
    const a = D.accounts.find(x=>x.id===id) || D.accounts[0];
    return `<section class="screen"><div class="screen-inner">${topbar(a.name,{eyebrow:a.number,notify:false})}
      <article class="balance-hero"><small>Available balance</small><strong>${fmt(a.balance)}</strong><div class="balance-meta"><span>Transit<b>00142</b></span><span>Account<b>${a.number}</b></span></div></article>
      <div class="button-row"><button class="button secondary" data-route="transfer">Transfer</button><button class="button primary" data-route="interac/recipient">Send money</button></div>
      <div class="section-title"><h2>Transactions</h2><button class="text-button" data-action="filters">${icon("filter")} Filters</button></div>
      <div class="search-wrap">${icon("search")}<input class="search-box" data-input="account-search" aria-label="Search transactions" placeholder="Search transactions"></div>
      <article class="card" style="margin-top:10px">${transactionRows(id === "savings" ? D.transactions.filter(t=>t.amount>0) : D.transactions)}</article>
    </div></section>`;
  }

  function transactionView(id) {
    const t = txById(id || state.selectedTransaction);
    return `<section class="screen"><div class="screen-inner">${topbar("Transaction details",{search:false})}
      <div class="detail-hero">${rowIcon(t.icon,t.amount>0?"success":"")}<h2>${t.merchant}</h2><p class="subtle">${t.meta.split(" · ")[0]}</p><div class="detail-amount ${t.amount>0?"positive":""}">${t.amount>0?"+":""}${fmt(t.amount)}</div><span class="badge ${t.status==="Completed"||t.status==="Autodeposited"?"success":"warning"}">${icon("check")} ${t.status}</span></div>
      <div class="detail-list">
        <div class="detail-line"><span>Account</span><strong>${t.account}</strong></div><div class="detail-line"><span>Category</span><strong>${t.meta.split(" · ")[1] || "Transfer"}</strong></div><div class="detail-line"><span>Time</span><strong>${t.time}</strong></div><div class="detail-line"><span>Location</span><strong>${t.location}</strong></div><div class="detail-line"><span>Reference</span><strong>${t.reference}</strong></div>
      </div>
      <div class="button-row"><button class="button secondary" data-action="category">Edit category</button><button class="button tertiary" data-route="transaction-report">Report an issue</button></div>
    </div></section>`;
  }

  function interacHub() {
    return `<section class="screen"><div class="screen-inner">${topbar("Interac e-Transfer",{add:"interac/add-recipient"})}
      <article class="balance-hero"><small>Available to send from Chequing</small><strong>${fmt(4826.42)}</strong><div class="balance-meta"><span>Daily remaining<b>$2,750.00</b></span></div></article>
      <div class="quick-actions" style="margin-top:14px;grid-template-columns:repeat(4,1fr)">${[["send","Send","interac/recipient"],["request","Request","interac/request"],["user","Contacts","contacts"],["document","History","interac/history"]].map(([i,l,r])=>`<button class="quick-action" data-route="${r}"><span class="quick-icon">${icon(i)}</span><span>${l}</span></button>`).join("")}</div>
      <div class="section-title"><h2>Recent activity</h2></div><article class="card">${transactionRows(D.transactions.filter(t=>t.id==="interac"))}</article>
      <div class="section-title"><h2>Recipients</h2></div><article class="card">${recipientRows()}</article>
    </div></section>`;
  }
  function paymentsHub() {
    return `<section class="screen"><div class="screen-inner">${topbar("Payments",{notify:true})}
      <div class="section-title"><h2>Payment services</h2></div>
      <div class="grid grid-2 payment-service-grid">
        <button class="card elevated service-card chevron" data-route="interac">${rowIcon("send")}<span class="row-copy"><strong>Interac e-Transfer</strong><small>Send, request, and manage contacts</small></span></button>
        <button class="card elevated service-card chevron" data-route="bills">${rowIcon("bill","teal")}<span class="row-copy"><strong>Bills</strong><small>Pay, schedule, and manage payees</small></span></button>
      </div>
      <div class="section-title"><h2>Quick actions</h2></div>
      <div class="quick-actions" style="grid-template-columns:repeat(4,1fr)">${[["send","Send","interac/recipient"],["request","Request","interac/request"],["transfer","Transfer","transfer"],["bill","Pay bill","bills/payee"]].map(([i,l,r])=>`<button class="quick-action" data-route="${r}"><span class="quick-icon">${icon(i)}</span><span>${l}</span></button>`).join("")}</div>
      <div class="section-title"><h2>Recent payments</h2></div><article class="card">${transactionRows(D.transactions.filter(t=>["interac","hydro"].includes(t.id)))}</article>
    </div></section>`;
  }
  function recipientRows() { return D.recipients.map(r=>`<button class="list-row chevron" data-recipient="${r.id}"><span class="avatar">${r.initials}</span><span class="row-copy"><strong>${r.name}</strong><small>${r.detail}</small></span>${r.auto?'<span class="badge success">Autodeposit</span>':""}</button>`).join(""); }

  function interacRecipient() {
    return `<section class="screen"><div class="screen-inner">${topbar("Choose recipient",{add:"interac/add-recipient"})}<div class="stepper">${[1,2,3,4].map((_,i)=>`<span class="${i===0?"done":""}"></span>`).join("")}</div>
      <div class="search-wrap">${icon("search")}<input class="search-box" aria-label="Search recipients" placeholder="Search recipients"></div>
      <div class="section-title"><h2>Recent</h2></div><article class="card">${recipientRows()}</article>
      <button class="button secondary full" style="margin-top:12px" data-route="interac/add-recipient">${icon("plus")} Add recipient</button>
    </div></section>`;
  }
  function interacAmount() {
    const r = recipientById(state.selectedRecipient);
    return `<section class="screen"><div class="screen-inner">${topbar("Send to ${r.name}",{search:false})}<div class="stepper">${[1,2,3,4].map((_,i)=>`<span class="${i<2?"done":""}"></span>`).join("")}</div>
      <div class="money-input"><label for="transfer-amount">Amount in CAD</label><span class="currency">$<input id="transfer-amount" inputmode="decimal" data-input="transfer-amount" value="${escapeHTML(state.transferAmount)}" aria-label="Transfer amount"></span><p class="caption">$4,826.42 available</p></div>
      <div class="field"><label for="transfer-message">Message (optional)</label><input id="transfer-message" placeholder="What is this for?" maxlength="80"></div>
      <div class="form-note">${icon("info")}<span>${r.auto?"Autodeposit is on. No security question is needed.":"This recipient requires a security question."}</span></div>
      <button class="button primary full" style="margin-top:18px" data-route="interac/review">Review transfer</button>
    </div></section>`;
  }
  function interacReview() {
    const r=recipientById(state.selectedRecipient);
    return `<section class="screen"><div class="screen-inner">${topbar("Review transfer",{search:false})}<div class="stepper">${[1,2,3,4].map((_,i)=>`<span class="${i<3?"done":""}"></span>`).join("")}</div>
      <div class="detail-hero"><span class="avatar" style="margin:auto">${r.initials}</span><h2 style="margin-top:10px">${r.name}</h2><div class="detail-amount">${fmt(Number(state.transferAmount)||0)}</div><span class="badge success">Autodeposit</span></div>
      <div class="detail-list"><div class="detail-line"><span>From</span><strong>Everyday Chequing •• 2847</strong></div><div class="detail-line"><span>Fee</span><strong>$0.00</strong></div><div class="detail-line"><span>Delivery</span><strong>Usually within minutes</strong></div></div>
      <div class="form-note" style="margin-top:12px">${icon("shield")}<span>Confirm with Touch ID before this transfer is sent.</span></div>
      <button class="button primary full" style="margin-top:16px" data-route="interac/fingerprint">Confirm and send</button>
    </div></section>`;
  }
  function fingerprintView(next="home",context="Sign in securely") {
    return `<section class="screen auth-step-screen"><div class="screen-inner"><div class="fingerprint-auth"><div class="fingerprint-glyph" aria-hidden="true">${icon("fingerprint")}</div><h2>Touch ID</h2><p class="subtle">${context}</p><button class="button primary" data-fingerprint-next="${next}">Use fingerprint</button><button class="button tertiary full" style="margin-top:8px" data-route="otp">Use verification code</button></div></div></section>`;
  }
  function successView(kind="transfer") {
    const isBill=kind==="bill", isCard=kind==="card", isOrder=kind==="order", isRequest=kind==="request", isTransfer=kind==="account";
    const title=isBill?"Bill paid":isCard?"Payment submitted":isOrder?`${state.orderSide} order submitted`:isRequest?"Request sent":isTransfer?"Transfer complete":"Transfer sent";
    const desc=isBill?`${fmt(Number(state.billAmount)||0)} was sent to ${payeeById(state.selectedPayee).name}.`:isCard?`${fmt(Number(state.cardPayment)||0)} was paid to your Mastercard.`:isOrder?`${state.orderSide} order for ${holdingById(state.selectedHolding).symbol} is pending execution.`:isRequest?`${fmt(Number(state.transferAmount)||0)} was requested from ${recipientById(state.selectedRecipient).name}.`:isTransfer?`${fmt(Number(state.transferAmount)||0)} moved to High Interest Savings.`:`${fmt(Number(state.transferAmount)||0)} was sent to ${recipientById(state.selectedRecipient).name}.`;
    const receiptRoute=isBill?"bills/receipt":isCard?"card":isOrder?"investments":isRequest?"interac":isTransfer?"accounts":"interac/receipt";
    return `<section class="screen"><div class="screen-inner"><div class="centered-state"><div class="success-glyph">✓</div><h2>${title}</h2><p>${desc}</p><div class="detail-list"><div class="detail-line"><span>Status</span><strong class="positive">${isOrder?"Submitted":"Completed"}</strong></div><div class="detail-line"><span>Reference</span><strong>NAB-849238</strong></div></div><button class="button primary full" style="margin-top:18px" data-route="${receiptRoute}">${isBill||!isCard&&!isOrder&&!isRequest&&!isTransfer?"View receipt":"Done"}</button><button class="button tertiary full" data-route="home">Return home</button></div></div></section>`;
  }

  function transferView(review=false) {
    return `<section class="screen"><div class="screen-inner">${topbar(review?"Review transfer":"Transfer between accounts",{search:false})}
      ${review?`<div class="detail-hero">${rowIcon("transfer","success")}<h2>To High Interest Savings</h2><div class="detail-amount">${fmt(Number(state.transferAmount)||0)}</div></div><div class="detail-list"><div class="detail-line"><span>From</span><strong>Everyday Chequing •• 2847</strong></div><div class="detail-line"><span>To</span><strong>High Interest Savings •• 6912</strong></div><div class="detail-line"><span>When</span><strong>Today</strong></div><div class="detail-line"><span>Frequency</span><strong>One time</strong></div></div><button class="button primary full" style="margin-top:16px" data-route="transfer/success">Confirm transfer</button>`:
      `<div class="field"><label>From</label><select><option>Everyday Chequing •• 2847 — $4,826.42</option><option>High Interest Savings •• 6912 — $12,480.75</option></select></div><div class="field"><label>To</label><select><option>High Interest Savings •• 6912 — $12,480.75</option><option>Everyday Chequing •• 2847 — $4,826.42</option></select></div><div class="field"><label>Amount</label><input data-input="transfer-amount" inputmode="decimal" value="${escapeHTML(state.transferAmount)}"></div><div class="grid grid-2"><div class="field"><label>Date</label><input type="date" value="2026-09-20"></div><div class="field"><label>Frequency</label><select><option>One time</option><option>Weekly</option><option>Biweekly</option><option>Monthly</option></select></div></div><div class="field"><label>Memo (optional)</label><input placeholder="Add a note"></div><button class="button primary full" data-route="transfer/review">Review transfer</button>`}
    </div></section>`;
  }

  function billsView() {
    return `<section class="screen"><div class="screen-inner">${topbar("Bills",{add:"bills/add-payee"})}<div class="button-row"><button class="button primary" data-route="bills/payee">Pay a bill</button><button class="button secondary" data-route="bills/add-payee">Add payee</button></div>
      <div class="section-title"><h2>Upcoming</h2></div><article class="card"><button class="list-row chevron" data-payee="mobile">${rowIcon("phone")}<span class="row-copy"><strong>Eastlink Mobile</strong><small>Scheduled tomorrow</small></span><span class="row-value"><strong>$86.40</strong><small>Chequing</small></span></button><button class="list-row chevron" data-payee="insurance">${rowIcon("shield","teal")}<span class="row-copy"><strong>Atlantic Insurance</strong><small>September 28</small></span><span class="row-value"><strong>$142.60</strong><small>Chequing</small></span></button></article>
      <div class="section-title"><h2>Payees</h2></div><article class="card">${payeeRows()}</article>
      <div class="section-title"><h2>Recent payments</h2></div><article class="card">${transactionRows(D.transactions.filter(t=>t.id==="hydro"))}</article>
    </div></section>`;
  }
  function payeeRows(){ return D.payees.map(p=>`<button class="list-row chevron" data-payee="${p.id}">${rowIcon(p.icon)}<span class="row-copy"><strong>${p.name}</strong><small>${p.detail}</small></span></button>`).join(""); }
  function payBillView(review=false) {
    const p=payeeById(state.selectedPayee);
    return `<section class="screen"><div class="screen-inner">${topbar(review?"Review payment":`Pay ${p.name}`,{search:false})}
    ${review?`<div class="detail-hero">${rowIcon(p.icon)}<h2>${p.name}</h2><div class="detail-amount">${fmt(Number(state.billAmount)||0)}</div></div><div class="detail-list"><div class="detail-line"><span>From</span><strong>Everyday Chequing •• 2847</strong></div><div class="detail-line"><span>Payment date</span><strong>September 20</strong></div><div class="detail-line"><span>Frequency</span><strong>One time</strong></div></div><button class="button primary full" style="margin-top:16px" data-route="bills/success">Confirm payment</button>`:
    `<div class="card-title"><h2>${p.name}</h2><span class="badge">${p.detail}</span></div><div class="field"><label>Payment account</label><select><option>Everyday Chequing •• 2847</option><option>High Interest Savings •• 6912</option></select></div><div class="field"><label>Amount</label><input inputmode="decimal" data-input="bill-amount" value="${escapeHTML(state.billAmount)}"></div><div class="grid grid-2"><div class="field"><label>Payment date</label><input type="date" value="2026-09-20"></div><div class="field"><label>Frequency</label><select><option>One time</option><option>Monthly</option></select></div></div><button class="button primary full" data-route="bills/review">Review payment</button>`}</div></section>`;
  }

  function bankCard(type="credit") {
    const locked=type==="credit"?state.cardLocked:state.debitLocked;
    return `<div class="bank-card ${locked?"locked":""}" aria-label="North Atlantic ${type==="credit"?"Mastercard":"Debit card"}${locked?", locked":""}"><div class="bank-card-top"><span>North Atlantic<br><small>${type==="credit"?"WORLD MASTERCARD":"DEBIT"}</small></span><span class="brand-mark brand-mark--small"><i></i></span></div><div class="chip"></div><div class="bank-card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;${type==="credit"?"4281":"2847"}</div><div class="bank-card-bottom"><span>ALEX MORGAN</span><span class="card-network">${type==="credit"?"MC":"INTERAC"}</span></div></div>`;
  }
  function cardView(type="credit") {
    const isCredit=type==="credit", locked=isCredit?state.cardLocked:state.debitLocked;
    return `<section class="screen"><div class="screen-inner">${topbar(isCredit?"Mastercard":"Debit card",{notify:false})}${bankCard(type)}
      ${locked?'<div class="form-note" style="margin-top:12px">'+icon("lock")+'<span>This card is locked. New purchases and cash withdrawals are declined.</span></div>':""}
      ${isCredit?`<div class="metric-grid" style="margin-top:14px"><div class="metric"><small>Current balance</small><strong>${fmt(D.card.current)}</strong></div><div class="metric"><small>Available credit</small><strong>${fmt(D.card.available)}</strong></div><div class="metric"><small>Minimum payment</small><strong>${fmt(D.card.minimum)}</strong></div><div class="metric"><small>Due date</small><strong>${D.card.due}</strong></div></div><div class="progress"><span style="width:12.86%"></span></div>`:`<div class="metric-grid" style="margin-top:14px"><div class="metric"><small>Linked account</small><strong>Chequing</strong></div><div class="metric"><small>Available</small><strong>${fmt(4826.42)}</strong></div></div>`}
      <div class="button-row">${isCredit?'<button class="button primary" data-route="card/pay">Pay card</button>':""}<button class="button ${locked?"primary":"secondary"}" data-action="${isCredit?"toggle-card-lock":"toggle-debit-lock"}">${icon(locked?"lock":"shield")} ${locked?"Unlock":"Lock"}</button></div>
      <div class="section-title"><h2>Controls</h2></div><article class="card">${controlRows(type)}</article>
      <div class="section-title"><h2>Recent activity</h2></div><article class="card">${transactionRows(D.transactions.filter(t=>t.account.includes(isCredit?"Mastercard":"Chequing")).slice(0,4))}</article>
    </div></section>`;
  }
  function controlRows(type){ const prefix=type==="credit"?"":"debit";return `<div class="setting-row">${rowIcon("card")}<span>Online purchases</span><button class="switch" role="switch" aria-label="Online purchases" aria-checked="${state.toggles.online}" data-toggle="online"></button></div><div class="setting-row">${rowIcon("building","teal")}<span>International purchases</span><button class="switch" role="switch" aria-label="International purchases" aria-checked="${state.toggles.international}" data-toggle="international"></button></div><div class="setting-row">${rowIcon("bell")}<span>Transaction notifications</span><button class="switch" role="switch" aria-label="Transaction notifications" aria-checked="${state.toggles[prefix+"Alerts"] ?? state.toggles.cardAlerts}" data-toggle="${prefix+"Alerts"}"></button></div><button class="list-row chevron" data-action="pin">${rowIcon("lock")}<span class="row-copy"><strong>Manage PIN</strong><small>Change or view PIN safely</small></span></button><button class="list-row chevron" data-action="lost-card">${rowIcon("shield")}<span class="row-copy"><strong>Lost, stolen or damaged</strong><small>Replace or report your card</small></span></button>`; }

  function investmentsView() {
    return `<section class="screen"><div class="screen-inner">${topbar("Investments",{notify:true})}<article class="balance-hero"><small>TFSA portfolio value</small><strong>${fmt(17842.36)}</strong><div class="balance-meta"><span>Today<b class="positive">+$84.12 (+0.47%)</b></span><span>Total return<b class="positive">+$1,628.40</b></span></div></article>
      <article class="card" style="margin-top:12px"><div class="card-title"><h2>Performance</h2><span class="badge success">+8.4%</span></div>${chartMarkup()}${rangeTabs()}</article>
      <div class="section-title"><h2>Holdings</h2></div><article class="card">${holdingRows()}</article>
      <div class="section-title"><h2>Allocation</h2></div><article class="card"><div class="grid grid-2"><div class="donut"></div><div class="legend"><div class="legend-row" style="--dot:var(--brand-navy)"><span>Canadian equity</span><b>42%</b></div><div class="legend-row" style="--dot:var(--brand-blue)"><span>US equity</span><b>35%</b></div><div class="legend-row" style="--dot:var(--brand-teal)"><span>International</span><b>15%</b></div><div class="legend-row" style="--dot:#758397"><span>Cash</span><b>8%</b></div></div></div></article>
      <p class="caption" style="margin-top:12px">For informational purposes only. This prototype does not provide investment advice.</p>
    </div></section>`;
  }
  function holdingRows(){return D.holdings.map(h=>`<button class="list-row chevron" data-holding="${h.id}"><span class="row-icon ${h.tone}"><strong style="font-size:10px">${h.symbol}</strong></span><span class="row-copy"><strong>${h.symbol}</strong><small>${h.name}</small></span><span class="row-value"><strong>${fmt(h.value)}</strong><small class="positive">+${h.gain}%</small></span></button>`).join("");}
  function holdingView(id=state.selectedHolding){ const h=holdingById(id);return `<section class="screen"><div class="screen-inner">${topbar(`${h.symbol} · ${h.name}`,{search:false})}<div class="card-title"><div><p class="eyebrow">Market price</p><h2 style="font-size:30px">${fmt(h.price)}</h2></div><span class="badge success">+${h.gain}% total</span></div>${chartMarkup()}${rangeTabs()}<div class="metric-grid" style="margin-top:15px"><div class="metric"><small>Market value</small><strong>${fmt(h.value)}</strong></div><div class="metric"><small>Quantity</small><strong>${h.quantity}</strong></div><div class="metric"><small>Average cost</small><strong>${fmt(h.price/(1+h.gain/100))}</strong></div><div class="metric"><small>Total gain</small><strong class="positive">+${fmt(h.value*h.gain/100)}</strong></div></div><div class="button-row"><button class="button secondary" data-order="Sell">Sell</button><button class="button primary" data-order="Buy">Buy</button></div><div class="form-note" style="margin-top:12px">${icon("info")}<span>Orders are simulated for this portfolio prototype. Market prices may change.</span></div></div></section>`;}
  function orderView(review=false){const h=holdingById(state.selectedHolding);return `<section class="screen"><div class="screen-inner">${topbar(`${state.orderSide} ${h.symbol}`,{search:false})}${review?`<div class="detail-hero"><span class="row-icon ${h.tone}" style="margin:auto"><strong style="font-size:10px">${h.symbol}</strong></span><h2>${state.orderSide} ${h.name}</h2><div class="detail-amount">${fmt(Number(state.orderAmount)||0)}</div></div><div class="detail-list"><div class="detail-line"><span>Account</span><strong>TFSA Investments</strong></div><div class="detail-line"><span>Order type</span><strong>Market order</strong></div><div class="detail-line"><span>Estimated units</span><strong>${((Number(state.orderAmount)||0)/h.price).toFixed(3)}</strong></div></div><div class="form-note" style="margin-top:12px">${icon("info")}<span>By confirming, you acknowledge that market orders may execute at a different price.</span></div><button class="button primary full" style="margin-top:15px" data-route="order/success">Confirm ${state.orderSide.toLowerCase()}</button>`:`<article class="card"><div class="card-title"><h2>${h.name}</h2><strong>${fmt(h.price)}</strong></div><div class="field"><label>Investment account</label><select><option>TFSA Investments — ${fmt(17842.36)}</option></select></div><div class="field"><label>Amount in CAD</label><input inputmode="decimal" data-input="order-amount" value="${escapeHTML(state.orderAmount)}"></div><div class="field"><label>Order type</label><select><option>Market order</option></select></div></article><button class="button primary full" style="margin-top:15px" data-route="order/review">Review order</button>`}</div></section>`;}

  function spendingView(){return `<section class="screen"><div class="screen-inner">${topbar("Spending & insights",{notify:false})}<article class="balance-hero"><small>September spending</small><strong>${fmt(3546.18)}</strong><div class="balance-meta"><span>vs. August<b class="positive">−$214.20</b></span><span>Budget remaining<b>$953.82</b></span></div></article><article class="card" style="margin-top:12px"><div class="card-title"><h2>By category</h2><span class="badge">Sep 1–20</span></div><div class="grid grid-2"><div class="donut"></div><div class="legend">${D.spending.slice(0,5).map(s=>`<button class="legend-row text-button" style="--dot:${s.color==='navy'?'var(--brand-navy)':s.color==='blue'?'var(--brand-blue)':s.color==='teal'?'var(--brand-teal)':s.color==='amber'?'#b87821':'#758397'}" data-category="${s.name}"><span>${s.name}</span><b>${fmt(s.value)}</b></button>`).join("")}</div></div></article><div class="section-title"><h2>Cash flow</h2></div><article class="card">${chartMarkup()}<div class="metric-grid"><div class="metric"><small>Income</small><strong class="positive">${fmt(3842.20)}</strong></div><div class="metric"><small>Expenses</small><strong>${fmt(3546.18)}</strong></div></div></article><div class="section-title"><h2>Plans & recurring</h2></div><article class="card"><button class="list-row chevron" data-action="subscriptions">${rowIcon("calendar")}<span class="row-copy"><strong>Subscriptions</strong><small>5 active · $82.43/month</small></span></button><button class="list-row chevron" data-action="savings-progress">${rowIcon("vault","teal")}<span class="row-copy"><strong>Savings progress</strong><small>78% of your September goal</small></span></button></article></div></section>`;}
  function categoryView(name){const s=D.spending.find(x=>x.name===name)||D.spending[1];return `<section class="screen"><div class="screen-inner">${topbar(s.name,{eyebrow:"September spending",search:false})}<article class="balance-hero"><small>Total spent</small><strong>${fmt(s.value)}</strong><div class="balance-meta"><span>Share of spending<b>${s.pct}%</b></span></div></article><div class="section-title"><h2>Transactions</h2></div><article class="card">${transactionRows(D.transactions.filter(t=>t.meta.toLowerCase().includes(s.name.toLowerCase())||s.name==="Food"&&t.id==="starbucks"))}</article></div></section>`;}

  function searchView(){const q=state.search.trim().toLowerCase();const all=[...D.transactions.map(t=>({title:t.merchant,sub:`Transaction · ${t.meta}`,route:`transaction/${t.id}`,icon:t.icon})),...D.accounts.map(a=>({title:a.name,sub:`Account · ${a.number}`,route:a.id==="mastercard"?"card":a.id==="investments"?"investments":`account/${a.id}`,icon:a.icon})),{title:"Transfer between accounts",sub:"Feature",route:"transfer",icon:"transfer"},{title:"September Mastercard statement",sub:"Document",route:"documents",icon:"document"},{title:"Touch ID",sub:"Fingerprint security setting",route:"security",icon:"fingerprint"}];const results=q?all.filter(x=>(x.title+" "+x.sub).toLowerCase().includes(q)):all.slice(0,7);return `<section class="screen"><div class="screen-inner">${topbar("Search",{search:false})}<div class="search-wrap">${icon("search")}<input autofocus class="search-box" data-input="global-search" value="${escapeHTML(state.search)}" aria-label="Global search" placeholder="Transactions, accounts, statements…"></div><div class="section-title"><h2>${q?`${results.length} result${results.length===1?"":"s"}`:"Suggested"}</h2></div><article class="card">${results.length?results.map(x=>`<button class="list-row chevron" data-route="${x.route}">${rowIcon(x.icon)}<span class="row-copy"><strong>${x.title}</strong><small>${x.sub}</small></span></button>`).join(""):`<div class="centered-state" style="padding:28px 12px">${rowIcon("search")}<h2>No results</h2><p>Try a merchant, account, feature, or statement.</p></div>`}</article></div></section>`;}
  function notificationsView(){return `<section class="screen"><div class="screen-inner">${topbar("Notifications",{search:false})}<div class="section-title"><h2>Recent</h2><button class="text-button" data-action="read-all">Mark all read</button></div><article class="card">${D.notifications.map(n=>`<button class="list-row chevron" data-notification="${n.id}">${rowIcon(n.icon)}<span class="row-copy"><strong>${n.title}</strong><small>${n.body}</small></span><span class="row-value"><small>${n.time}</small>${n.unread&&!state.noticeRead.has(n.id)?'<span class="unread-dot" aria-label="Unread"></span>':""}</span></button>`).join("")}</article></div></section>`;}

  function moreView(){const rows=[["user","Profile","Personal and contact details","profile"],["fingerprint","Security","Touch ID, password and trusted devices","security"],["settings","Settings","Appearance, accessibility and alerts","settings"],["chart","Spending & insights","Budgets, trends and subscriptions","spending"],["document","Documents","Statements and tax documents","documents"],["help","Help & support","Secure chat and frequently asked questions","help"]];return `<section class="screen"><div class="screen-inner">${topbar("More",{notify:true})}<button class="profile-card" data-route="profile" aria-label="Open Alex Morgan profile"><span class="avatar">AM</span><span><strong>Alex Morgan</strong><small>Client since 2019</small></span>${icon("arrow")}</button><div class="section-title"><h2>Services</h2></div><article class="card">${rows.map(([i,t,s,r])=>`<button class="list-row chevron" data-route="${r}">${rowIcon(i)}<span class="row-copy"><strong>${t}</strong><small>${s}</small></span></button>`).join("")}</article><button class="button danger full" style="margin-top:14px" data-action="sign-out">Sign out</button></div></section>`;}
  function profileView(){return `<section class="screen"><div class="screen-inner">${topbar("Profile",{search:false})}<div class="detail-hero"><span class="avatar" style="width:68px;height:68px;margin:auto;font-size:18px">AM</span><h2 style="margin-top:12px">Alex Morgan</h2><p class="subtle">Halifax, Nova Scotia</p></div><article class="card"><div class="detail-line"><span>Full name</span><strong>Alex Morgan</strong></div><div class="detail-line"><span>Email</span><strong>alex.morgan@example.com</strong></div><div class="detail-line"><span>Mobile</span><strong>+1 902 555 0186</strong></div><div class="detail-line"><span>Address</span><strong>Halifax, NS</strong></div></article><button class="button secondary full" style="margin-top:14px" data-action="edit-profile">Edit profile details</button></div></section>`;}
  function securityView(){return `<section class="screen"><div class="screen-inner">${topbar("Security",{search:false})}<div class="form-note">${icon("shield")}<span>Your account is protected. We’ll calmly guide you if action is needed.</span></div><div class="section-title"><h2>Sign-in security</h2></div><article class="card"><div class="setting-row">${rowIcon("fingerprint")}<span>Touch ID</span><button class="switch" role="switch" aria-label="Touch ID fingerprint" aria-checked="${state.toggles.fingerprint}" data-toggle="fingerprint"></button></div><div class="setting-row">${rowIcon("lock")}<span>Two-factor authentication</span><button class="switch" role="switch" aria-label="Two-factor authentication" aria-checked="${state.toggles.twofactor}" data-toggle="twofactor"></button></div><button class="list-row chevron" data-action="password">${rowIcon("lock")}<span class="row-copy"><strong>Password</strong><small>Updated 48 days ago</small></span></button><button class="list-row chevron" data-action="trusted">${rowIcon("phone")}<span class="row-copy"><strong>Trusted devices</strong><small>iPhone Duo and MacBook Pro</small></span></button></article><div class="section-title"><h2>Recent security activity</h2></div><article class="card"><div class="list-row">${rowIcon("check","success")}<span class="row-copy"><strong>Safari on Mac verified</strong><small>September 18 · Halifax, NS</small></span><span class="badge success">You</span></div></article><button class="button danger full" style="margin-top:14px" data-action="fraud">Report fraud or suspicious activity</button></div></section>`;}
  function settingsView(){return `<section class="screen"><div class="screen-inner">${topbar("Settings",{search:false})}<div class="section-title"><h2>Appearance</h2></div><article class="card"><p class="subtle settings-copy">Light mode is the default. Your choice is saved on this device.</p><div class="appearance-picker" role="group" aria-label="Appearance"><button data-theme-choice="light" aria-pressed="${state.theme==="light"}">${icon("sun")}<span><strong>Light</strong><small>Bright and clear</small></span><i class="selection-mark"></i></button><button data-theme-choice="dark" aria-pressed="${state.theme==="dark"}">${icon("moon")}<span><strong>Dark</strong><small>Reduced glare</small></span><i class="selection-mark"></i></button></div></article><div class="section-title"><h2>Preferences</h2></div><article class="card"><div class="setting-row">${rowIcon("bell")}<span>Card and account alerts</span><button class="switch" role="switch" aria-label="Card and account alerts" aria-checked="${state.toggles.cardAlerts}" data-toggle="cardAlerts"></button></div><button class="list-row chevron" data-action="accessibility">${rowIcon("eye")}<span class="row-copy"><strong>Accessibility</strong><small>Display and motion preferences</small></span></button><button class="list-row chevron" data-route="states">${rowIcon("settings")}<span class="row-copy"><strong>System states</strong><small>Loading, empty and error patterns</small></span></button></article></div></section>`;}
  function documentsView(){return `<section class="screen"><div class="screen-inner">${topbar("Documents",{search:false})}<div class="field"><label>Year</label><select><option>2026</option><option>2025</option><option>2024</option></select></div><article class="card">${[["September Mastercard statement","Sep 1–20 · PDF","card"],["August banking statement","Aug 1–31 · PDF","accounts"],["Q3 TFSA investment statement","Jul–Sep · PDF","investments"],["2025 TFSA tax receipt","Tax document · PDF","document"]].map(([t,s,i])=>`<button class="list-row chevron" data-action="document-preview">${rowIcon(i)}<span class="row-copy"><strong>${t}</strong><small>${s}</small></span><span class="badge">PDF</span></button>`).join("")}</article></div></section>`;}
  function helpView(){return `<section class="screen"><div class="screen-inner">${topbar("Help Center",{search:false})}<div class="search-wrap">${icon("search")}<input class="search-box" placeholder="Search help" aria-label="Search help"></div><div class="button-row"><button class="button primary" data-route="help/chat">${icon("chat")} Secure chat</button><button class="button secondary" data-action="contact">Contact us</button></div><div class="section-title"><h2>Popular topics</h2></div><article class="card">${[["card","Cards","Lock, replace, or manage a card"],["transfer","Transfers","Interac and account transfers"],["bill","Bill payments","Payees, schedules, and failures"],["shield","Report fraud","Get help with suspicious activity"]].map(([i,t,s])=>`<button class="list-row chevron" data-action="help-topic">${rowIcon(i)}<span class="row-copy"><strong>${t}</strong><small>${s}</small></span></button>`).join("")}</article><div class="section-title"><h2>Frequently asked</h2></div><article class="card"><button class="list-row chevron" data-action="faq"><span class="row-copy"><strong>Where can I find my statements?</strong><small>Documents are available for seven years.</small></span></button><button class="list-row chevron" data-action="faq"><span class="row-copy"><strong>How do I change an Interac limit?</strong><small>Limits help protect your account.</small></span></button></article></div></section>`;}
  function chatView(){return `<section class="screen"><div class="screen-inner">${topbar("Secure chat",{eyebrow:"North Atlantic Support",search:false})}<div class="form-note">${icon("shield")}<span>This is a secure conversation. Never share your password or verification code.</span></div><div class="chat"><div class="bubble">Hi Alex — I’m Nora from North Atlantic Support. How can I help today?</div><div class="bubble me">I have a question about an upcoming card payment.</div><div class="bubble">Of course. Your minimum payment is $45.00 and it’s due September 24. Would you like help reviewing payment options?</div></div><div class="chat-compose"><input id="chat-message" aria-label="Message" placeholder="Write a message"><button class="button primary" data-action="send-chat" aria-label="Send message">${icon("send")}</button></div></div></section>`;}
  function statesView(){const states=[["Loading","Fetching account activity"],["Empty","No transactions yet"],["Offline","Reconnect to continue"],["No results","Try another search"],["Error","Something needs another try"],["Invalid OTP","Check the six-digit code"],["Insufficient funds","Choose another account"],["Card locked","Purchases are paused"],["Success","Your action is complete"],["Warning","Review before continuing"]];return `<section class="screen"><div class="screen-inner">${topbar("System states",{search:false})}<div class="state-grid">${states.map(([t,s])=>`<button class="state-chip" data-system-state="${t}"><strong>${t}</strong><small>${s}</small></button>`).join("")}</div><div class="section-title"><h2>Skeleton loading</h2></div><article class="card skeleton" aria-label="Loading example"><span></span><span></span><span></span></article></div></section>`;}

  function authView(){return `<section class="auth-screen"><div class="auth-brand"><span class="brand-mark"><i></i></span><span>North Atlantic Bank</span></div><div class="auth-panel"><p class="eyebrow">Welcome back</p><p class="subtle">Sign in to continue as Alex Morgan.</p><form id="signin-form"><div class="field"><label for="client-number">Client number</label><input id="client-number" autocomplete="username" value="2847 6912" required></div><div class="field"><label for="password">Password</label><div class="password-field"><input id="password" type="password" autocomplete="current-password" value="northatlantic" required minlength="6"><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Show password" aria-pressed="false">${icon("eye")}</button></div></div><button class="button primary full" type="submit">Sign in securely</button></form><button class="button tertiary full" data-route="forgot">Forgot password?</button><div class="form-note">${icon("shield")}<span>This is a fictional portfolio prototype. No credentials are transmitted or stored.</span></div></div></section>`;}
  function otpView(){return `<section class="screen"><div class="screen-inner">${topbar("Verification code",{search:false})}<div class="centered-state" style="padding-top:22px">${rowIcon("phone")}<h2>Check your trusted device</h2><p>Enter the six-digit code sent to ••• ••• 0186. Try <strong>284719</strong>.</p><div class="field"><label for="otp">Six-digit code</label><input id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" data-input="otp" style="text-align:center;letter-spacing:.35em;font-size:22px" aria-describedby="otp-error"><span id="otp-error" class="error-text" hidden>That code is incorrect. Try 284719.</span></div><button class="button primary full" data-action="verify-otp">Verify code</button></div></div></section>`;}
  function genericForm(title,fields,action,label){return `<section class="screen"><div class="screen-inner">${topbar(title,{search:false})}${fields}<button class="button primary full" data-action="${action}">${label}</button></div></section>`;}

  function viewForRoute(route) {
    if (route === "signin") return authView();
    if (route === "fingerprint") return fingerprintView("home","Sign in to North Atlantic Bank");
    if (route === "otp") return otpView();
    if (route === "forgot") return genericForm("Reset password",'<p class="subtle">We’ll send secure reset instructions to your verified contact.</p><div class="field"><label>Email or client number</label><input value="alex.morgan@example.com"></div>',"password-reset","Send instructions");
    if (route === "home") return homeView();
    if (route === "accounts") return accountsView();
    if (route.startsWith("account/")) return accountView(route.split("/")[1]);
    if (route.startsWith("transaction/") && route !== "transaction-report") return transactionView(route.split("/")[1]);
    if (route === "transaction-report") return genericForm("Report transaction",'<div class="form-note">'+icon("shield")+'<span>We’ll pause the card if needed and connect you with a specialist.</span></div><div class="field" style="margin-top:15px"><label>What happened?</label><select><option>I don’t recognize this transaction</option><option>Amount is incorrect</option><option>Charged more than once</option></select></div><div class="field"><label>Details</label><textarea placeholder="Tell us what you noticed"></textarea></div>',"report-submitted","Submit report");
    if (route === "payments") return paymentsHub();
    if (route === "interac") return interacHub();
    if (route === "contacts") return `<section class="screen"><div class="screen-inner">${topbar("Interac contacts",{add:"interac/add-recipient"})}<article class="card">${recipientRows()}</article></div></section>`;
    if (route === "interac/recipient") return interacRecipient();
    if (route === "interac/amount") return interacAmount();
    if (route === "interac/review") return interacReview();
    if (route === "interac/fingerprint") return fingerprintView("interac/success","Confirm your Interac e-Transfer");
    if (route === "interac/success") return successView("interac");
    if (route === "interac/receipt") return receiptView("Interac e-Transfer receipt",recipientById(state.selectedRecipient).name,Number(state.transferAmount)||0);
    if (route === "interac/request") return requestMoneyView(false);
    if (route === "interac/request/review") return requestMoneyView(true);
    if (route === "interac/request/success") return successView("request");
    if (route === "interac/add-recipient") return genericForm("Add recipient",'<div class="field"><label>Full name</label><input id="new-recipient-name" value="Jordan Lee"></div><div class="field"><label>Email or mobile number</label><input value="jordan.lee@example.com"></div><div class="field"><label>Notification language</label><select><option>English</option><option>French</option></select></div>',"save-recipient","Save recipient");
    if (route === "interac/history") return `<section class="screen"><div class="screen-inner">${topbar("Transfer history",{search:false})}<article class="card">${transactionRows(D.transactions.filter(t=>t.id==="interac"))}</article></div></section>`;
    if (route === "transfer") return transferView(false);
    if (route === "transfer/review") return transferView(true);
    if (route === "transfer/success") return successView("account");
    if (route === "bills") return billsView();
    if (route === "bills/payee") return `<section class="screen"><div class="screen-inner">${topbar("Choose payee",{add:"bills/add-payee"})}<div class="search-wrap">${icon("search")}<input class="search-box" placeholder="Search payees" aria-label="Search payees"></div><article class="card" style="margin-top:12px">${payeeRows()}</article></div></section>`;
    if (route === "bills/payment") return payBillView(false);
    if (route === "bills/review") return payBillView(true);
    if (route === "bills/success") return successView("bill");
    if (route === "bills/receipt") return receiptView("Bill payment receipt",payeeById(state.selectedPayee).name,Number(state.billAmount)||0);
    if (route === "bills/add-payee") return genericForm("Add payee",'<div class="field"><label>Company</label><input value="Halifax Water"></div><div class="field"><label>Account number</label><input value="68291047"></div><div class="field"><label>Nickname (optional)</label><input value="Water bill"></div>',"save-payee","Save and pay");
    if (route === "cards") return cardsHub();
    if (route === "card") return cardView("credit");
    if (route === "card/pay") return cardPayView(false);
    if (route === "card/pay/review") return cardPayView(true);
    if (route === "card/pay/success") return successView("card");
    if (route === "debit" || route === "debit/controls") return cardView("debit");
    if (route === "investments") return investmentsView();
    if (route.startsWith("holding/")) return holdingView(route.split("/")[1]);
    if (route === "order") return orderView(false);
    if (route === "order/review") return orderView(true);
    if (route === "order/success") return successView("order");
    if (route === "spending") return spendingView();
    if (route.startsWith("spending/category/")) return categoryView(decodeURIComponent(route.split("/").slice(2).join("/")));
    if (route === "search") return searchView();
    if (route === "notifications") return notificationsView();
    if (route === "profile") return profileView();
    if (route === "security") return securityView();
    if (route === "settings") return settingsView();
    if (route === "documents") return documentsView();
    if (route === "help") return helpView();
    if (route === "help/chat") return chatView();
    if (route === "states") return statesView();
    if (route === "more") return moreView();
    if (route === "deposit") return genericForm("Mobile deposit",'<div class="centered-state" style="padding:20px"><div class="success-glyph">▣</div><h2>Deposit a cheque</h2><p>In a real app, the camera would securely capture both sides of your cheque.</p></div>',"deposit-demo","Start camera simulation");
    return homeView();
  }

  function requestMoneyView(review){const r=recipientById(state.selectedRecipient);return `<section class="screen"><div class="screen-inner">${topbar(review?"Review request":"Request money",{search:false})}${review?`<div class="detail-hero"><span class="avatar" style="margin:auto">${r.initials}</span><h2>${r.name}</h2><div class="detail-amount">${fmt(Number(state.transferAmount)||0)}</div></div><div class="detail-list"><div class="detail-line"><span>Deposit to</span><strong>Everyday Chequing •• 2847</strong></div><div class="detail-line"><span>Reason</span><strong>Shared expenses</strong></div></div><button class="button primary full" style="margin-top:16px" data-route="interac/request/success">Send request</button>`:`<div class="field"><label>Contact</label><select data-input="recipient-select">${D.recipients.map(x=>`<option value="${x.id}" ${x.id===state.selectedRecipient?"selected":""}>${x.name}</option>`).join("")}</select></div><div class="field"><label>Amount</label><input data-input="transfer-amount" inputmode="decimal" value="${escapeHTML(state.transferAmount)}"></div><div class="field"><label>Reason</label><input value="Shared expenses"></div><button class="button primary full" data-route="interac/request/review">Review request</button>`}</div></section>`;}
  function receiptView(title,to,amount){return `<section class="screen"><div class="screen-inner">${topbar(title,{search:false})}<div class="detail-hero"><div class="success-glyph">✓</div><h2>${to}</h2><div class="detail-amount">${fmt(amount)}</div><span class="badge success">Completed</span></div><div class="detail-list"><div class="detail-line"><span>Date</span><strong>September 20, 2026</strong></div><div class="detail-line"><span>From</span><strong>Everyday Chequing •• 2847</strong></div><div class="detail-line"><span>Reference</span><strong>NAB-849221</strong></div></div><button class="button primary full" style="margin-top:16px" data-route="home">Done</button></div></section>`;}
  function cardsHub(){return `<section class="screen"><div class="screen-inner">${topbar("Cards",{notify:false})}<div class="grid cards-hub-grid"><button class="card elevated card-choice" style="border:0;text-align:left" data-route="card">${bankCard("credit")}<div class="card-title" style="margin:14px 0 0"><div><h2>Mastercard</h2><span class="caption">Current ${fmt(D.card.current)}</span></div><span class="chevron"></span></div></button><button class="card elevated card-choice" style="border:0;text-align:left" data-route="debit">${bankCard("debit")}<div class="card-title" style="margin:14px 0 0"><div><h2>Debit</h2><span class="caption">Linked to Chequing</span></div><span class="chevron"></span></div></button></div></div></section>`;}
  function cardPayView(review){return `<section class="screen"><div class="screen-inner">${topbar(review?"Review card payment":"Pay Mastercard",{search:false})}${review?`<div class="detail-hero">${rowIcon("card","navy")}<h2>North Atlantic Mastercard</h2><div class="detail-amount">${fmt(Number(state.cardPayment)||0)}</div></div><div class="detail-list"><div class="detail-line"><span>From</span><strong>Everyday Chequing •• 2847</strong></div><div class="detail-line"><span>Payment date</span><strong>Today</strong></div><div class="detail-line"><span>After payment</span><strong>${fmt(Math.max(0,D.card.current-(Number(state.cardPayment)||0)))}</strong></div></div><button class="button primary full" style="margin-top:16px" data-route="card/pay/success">Confirm payment</button>`:`<div class="metric-grid"><button class="metric" data-card-amount="45"><small>Minimum payment</small><strong>$45.00</strong></button><button class="metric" data-card-amount="1112.84"><small>Statement balance</small><strong>$1,112.84</strong></button></div><div class="field" style="margin-top:14px"><label>Amount</label><input data-input="card-payment" inputmode="decimal" value="${escapeHTML(state.cardPayment)}"></div><div class="field"><label>Payment account</label><select><option>Everyday Chequing •• 2847 — $4,826.42</option><option>High Interest Savings •• 6912 — $12,480.75</option></select></div><button class="button primary full" data-route="card/pay/review">Review payment</button>`}</div></section>`;}

  const navItems = [["home","Home","home"],["accounts","Accounts","accounts"],["payments","Payments","payments"],["card","Cards","cards"],["chart","Invest","investments"],["more","More","more"]];
  function bottomNav(){const base=routeBase();return `<nav class="bottom-nav" aria-label="Primary navigation">${navItems.slice(0,5).map(([i,l,r],idx)=>`<button data-route="${r}" class="${base===(idx===2?"payments":r)?"is-active":""}" aria-current="${base===(idx===2?"payments":r)?"page":"false"}">${icon(i)}<span>${l}</span></button>`).join("")}</nav>`;}
  function sidebar(){const base=routeBase();return `<aside class="sidebar"><div class="sidebar-brand"><span class="brand-mark brand-mark--small"><i></i></span><span>North Atlantic</span></div><nav class="sidebar-nav" aria-label="Primary navigation">${navItems.map(([i,l,r],idx)=>`<button data-route="${r}" class="${base===(idx===2?"payments":r)?"is-active":""}" aria-current="${base===(idx===2?"payments":r)?"page":"false"}">${icon(i)}<span>${l}</span></button>`).join("")}</nav><button class="sidebar-profile" data-route="profile" aria-label="Open Alex Morgan profile"><span class="avatar">AM</span><span><strong>Alex Morgan</strong></span></button></aside>`;}

  function masterList(title, kicker, items) {
    return `<section class="screen"><div class="screen-inner"><p class="master-kicker">${kicker}</p><div class="topbar"><h1>${title}</h1></div><div class="master-list">${items.map(([i,t,s,r,selected])=>`<button class="list-row chevron ${selected?"is-selected":""}" data-route="${r}">${rowIcon(i)}<span class="row-copy"><strong>${t}</strong><small>${s}</small></span></button>`).join("")}</div></div></section>`;
  }
  function masterForRoute(){
    const base=routeBase();
    if(base==="home")return `<section class="screen"><div class="screen-inner"><p class="master-kicker">Overview</p><div class="topbar"><h1>Today</h1></div><article class="balance-hero"><small>Total financial position</small><strong>${fmt(accountTotal)}</strong><div class="balance-meta"><span>Cash<b>${fmt(17307.17)}</b></span><span>Investments<b>${fmt(17842.36)}</b></span><span>Credit<b>−${fmt(1286.34)}</b></span></div></article><div class="section-title"><h2>Navigate</h2></div><div class="master-list"><button class="list-row chevron" data-route="accounts">${rowIcon("accounts")}<span class="row-copy"><strong>Accounts</strong><small>Cash, credit, and investments</small></span></button><button class="list-row chevron" data-route="payments">${rowIcon("payments")}<span class="row-copy"><strong>Payments</strong><small>Interac, bills, and transfers</small></span></button><button class="list-row chevron" data-route="cards">${rowIcon("card")}<span class="row-copy"><strong>Cards</strong><small>Controls and statements</small></span></button><button class="list-row chevron" data-route="investments">${rowIcon("chart")}<span class="row-copy"><strong>Investments</strong><small>Portfolio and orders</small></span></button><button class="list-row chevron" data-route="more">${rowIcon("more")}<span class="row-copy"><strong>More</strong><small>Profile, settings and support</small></span></button></div></div></section>`;
    if(base==="accounts")return masterList("Accounts","Banking",D.accounts.map(a=>[a.icon,a.name,a.number,a.id==="mastercard"?"card":a.id==="investments"?"investments":`account/${a.id}`,state.route.includes(a.id)]));
    if(base==="payments")return masterList("Payments","Move money",[["payments","Overview","All payment services","payments",state.route==="payments"],["send","Interac e-Transfer","Send, request, and contacts","interac",state.route.startsWith("interac")||state.route==="contacts"],["bill","Bills","Payees and scheduled payments","bills",state.route.startsWith("bills")],["transfer","Between accounts","Move money internally","transfer",state.route.startsWith("transfer")]]);
    if(base==="cards")return masterList("Cards","Manage",[["card","Mastercard •• 4281",`${fmt(D.card.current)} current balance`,"card",state.route.startsWith("card")],["card","Debit •• 2847","Linked to Chequing","debit",state.route.startsWith("debit")]]);
    if(base==="investments")return masterList("Investments","Portfolio",D.holdings.map(h=>["chart",`${h.symbol} · ${h.name}`,fmt(h.value),`holding/${h.id}`,state.route.includes(h.id)]));
    return masterList("More","Account & support",[["user","Alex Morgan","Profile and contact details","profile",state.route==="profile"||state.route==="more"],["fingerprint","Security","Touch ID and trusted devices","security",state.route==="security"],["settings","Settings","Appearance, accessibility and alerts","settings",state.route==="settings"],["chart","Spending & insights","Budgets and trends","spending",state.route.startsWith("spending")],["document","Documents","Statements and tax slips","documents",state.route==="documents"],["help","Help & support","Chat and popular topics","help",state.route.startsWith("help")]]);
  }

  function renderShell(){
    const view=viewForRoute(state.route);
    if(isAuthRoute())return view;
    if(state.device==="closed")return `<div class="compact-shell">${view}${bottomNav()}</div>`;
    if(state.device==="open")return `<div class="open-shell">${sidebar()}<main class="open-main">${view}</main></div>`;
    const primaryRoute=state.splitRoutes.primary;
    const secondaryRoute=state.splitRoutes.secondary;
    const primary=withRoute(primaryRoute,()=>viewForRoute(primaryRoute));
    const secondary=withRoute(secondaryRoute,()=>secondaryRoute==="home"?masterForRoute():viewForRoute(secondaryRoute));
    return `<div class="split-shell"><div class="split-pane split-pane--master" data-split-pane="secondary">${secondary}</div><div class="split-hinge" aria-hidden="true"></div><main class="split-pane" data-split-pane="primary">${primary}</main></div>`;
  }

  function modalMarkup(){if(!state.modal)return "";let content="";if(state.modal.type==="confirm-lock")content=`<h2>${state.cardLocked?"Unlock":"Lock"} Mastercard?</h2><p class="subtle">${state.cardLocked?"New purchases will be allowed again.":"New purchases and cash withdrawals will be declined until you unlock it."}</p><div class="button-row"><button class="button secondary" data-action="close-modal">Cancel</button><button class="button ${state.cardLocked?"primary":"danger"}" data-action="confirm-card-lock">${state.cardLocked?"Unlock":"Lock card"}</button></div>`;else content=`<div class="centered-state" style="padding:8px"><div class="success-glyph">${state.modal.icon||"✓"}</div><h2>${state.modal.title}</h2><p>${state.modal.body}</p><button class="button primary full" data-action="close-modal">Done</button></div>`;return `<div class="modal-backdrop" role="presentation" data-action="close-modal"><div class="modal-sheet" role="dialog" aria-modal="true" aria-label="${escapeHTML(state.modal.title||"Confirmation")}" data-modal-sheet>${content}</div></div>`;}
  function showInfo(title,body,iconText="✓"){state.modal={type:"info",title,body,icon:iconText};render();}
  function usesQuarterLayout(angle=state.rotation){const normalized=((angle%360)+360)%360;return (normalized>=45&&normalized<135)||(normalized>=225&&normalized<315);}
  function railRouteFor(route){const base=routeBaseFor(route);return base==="payments"?"payments":base==="more"?"more":"home";}
  function bindPasswordToggle(){const button=root.querySelector("[data-action='toggle-password']");const input=root.querySelector("#password");if(!button||!input)return;button.addEventListener("click",event=>{event.stopPropagation();const visible=input.type==="text";input.type=visible?"password":"text";button.setAttribute("aria-pressed",String(!visible));button.setAttribute("aria-label",visible?"Show password":"Hide password");button.classList.toggle("is-visible",!visible);});}
  function render(){document.documentElement.dataset.theme=state.theme;device.className=`duo-device mode-${state.device}${isAuthRoute()?" is-auth":""}${state.route==="fingerprint"?" is-auth-step":""}${usesQuarterLayout()?" is-quarter":" is-upright"}`;device.dataset.rotation=String(state.rotation);root.innerHTML=renderShell()+modalMarkup()+`<div class="toast" role="status"></div>`;bindPasswordToggle();updateControls();updateScale();document.querySelectorAll(".rail-tabs button").forEach(button=>button.classList.remove("is-active"));const primaryRoute=state.device==="split"?state.splitRoutes.primary:state.route;if(state.device==="split"&&usesQuarterLayout()){document.querySelector(`.side-rail--left .rail-tabs [data-route="${railRouteFor(primaryRoute)}"]`)?.classList.add("is-active");document.querySelector(`.side-rail--right .rail-tabs [data-route="${railRouteFor(state.splitRoutes.secondary)}"]`)?.classList.add("is-active");}else{document.querySelector(`.side-rail--right .rail-tabs [data-route="${railRouteFor(primaryRoute)}"]`)?.classList.add("is-active");if(state.device==="split")document.querySelector(`.side-rail--left .rail-tabs [data-route="${railRouteFor(state.splitRoutes.secondary)}"]`)?.classList.add("is-active");}}
  function updateControls(){document.querySelectorAll("[data-device]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.device===state.device)));const rotate=document.querySelector("#rotate-demo");rotate.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4v6h6M5.5 16a8 8 0 1 0 .5-9l-2 3"/></svg>';rotate.setAttribute("aria-label",`Rotate device. Current orientation ${state.rotation} degrees`);rotate.title=`Rotate device · ${state.rotation}°`;}
  function updateScale(){const stage=document.querySelector(".device-stage");if(!stage)return;const styles=getComputedStyle(device);const naturalW=parseFloat(styles.getPropertyValue("--device-w"))+28,naturalH=parseFloat(styles.getPropertyValue("--device-h"))+28;const box=stage.getBoundingClientRect();const scale=Math.min(box.width/naturalW,box.height/naturalH,1);device.style.transform=`scale(${scale})`;device.style.transformOrigin="top left";deviceWrap.style.width=`${naturalW*scale}px`;deviceWrap.style.height=`${naturalH*scale}px`;}
  function toast(message){const el=root.querySelector(".toast");if(!el)return;el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200);announce(message);}

  document.querySelector(".demo-controls").addEventListener("click",e=>{const deviceButton=e.target.closest("[data-device]");if(deviceButton){const next=deviceButton.dataset.device;if(next==="split"&&state.device!=="split")state.splitRoutes.primary=state.route;if(state.device==="split"&&next!=="split")state.route=state.splitRoutes.primary;state.device=next;localStorage.setItem("nab-device",state.device);render();announce(`${deviceButton.textContent} device state. Current task preserved.`);return;}if(e.target.closest("#rotate-demo")){const index=ROTATIONS.indexOf(state.rotation);state.rotation=ROTATIONS[(index+1)%ROTATIONS.length];localStorage.setItem("nab-rotation",String(state.rotation));render();announce(`Device orientation ${state.rotation} degrees`);}});
  document.querySelectorAll(".side-rail").forEach(rail=>rail.addEventListener("click",e=>{const route=e.target.closest("[data-route]")?.dataset.route;const action=e.target.closest("[data-action]")?.dataset.action;const pane=state.device==="split"&&usesQuarterLayout()?(rail.classList.contains("side-rail--left")?"primary":"secondary"):rail.dataset.pane;if(state.device==="split"&&!isAuthRoute()){if(route)navigatePane(pane,route);else if(action==="back")goBackPane(pane);}else if(route)navigate(route);else if(action==="back")goBack();}));

  root.addEventListener("submit",e=>{if(e.target.id==="signin-form"){e.preventDefault();navigate("fingerprint");}});
  root.addEventListener("click",e=>{
    if(e.target.closest("[data-modal-sheet]"))e.stopPropagation();
    const pane=paneForTarget(e.target);const open=route=>pane?navigatePane(pane,route):navigate(route);
    const routeEl=e.target.closest("[data-route]");if(routeEl){open(routeEl.dataset.route);return;}
    const tx=e.target.closest("[data-transaction]");if(tx){state.selectedTransaction=tx.dataset.transaction;open(`transaction/${tx.dataset.transaction}`);return;}
    const rec=e.target.closest("[data-recipient]");if(rec){state.selectedRecipient=rec.dataset.recipient;open("interac/amount");return;}
    const pay=e.target.closest("[data-payee]");if(pay){state.selectedPayee=pay.dataset.payee;open("bills/payment");return;}
    const hold=e.target.closest("[data-holding]");if(hold){state.selectedHolding=hold.dataset.holding;open(`holding/${hold.dataset.holding}`);return;}
    const order=e.target.closest("[data-order]");if(order){state.orderSide=order.dataset.order;open("order");return;}
    const range=e.target.closest("[data-range]");if(range){state.chartRange=range.dataset.range;render();toast(`Chart range: ${state.chartRange}`);return;}
    const category=e.target.closest("[data-category]");if(category){open(`spending/category/${encodeURIComponent(category.dataset.category)}`);return;}
    const cardAmount=e.target.closest("[data-card-amount]");if(cardAmount){state.cardPayment=cardAmount.dataset.cardAmount;render();return;}
    const notification=e.target.closest("[data-notification]");if(notification){const n=D.notifications.find(x=>x.id===notification.dataset.notification);state.noticeRead.add(n.id);open(n.route);return;}
    const themeChoice=e.target.closest("[data-theme-choice]");if(themeChoice){state.theme=themeChoice.dataset.themeChoice;localStorage.setItem("nab-theme-v2",state.theme);render();announce(`${state.theme} mode`);return;}
    const toggle=e.target.closest("[data-toggle]");if(toggle){const key=toggle.dataset.toggle;if(!(key in state.toggles))state.toggles[key]=true;state.toggles[key]=!state.toggles[key];render();announce(`${toggle.getAttribute("aria-label")}: ${state.toggles[key]?"on":"off"}`);return;}
    const fingerprint=e.target.closest("[data-fingerprint-next]");if(fingerprint){navigate(fingerprint.dataset.fingerprintNext);return;}
    const sys=e.target.closest("[data-system-state]");if(sys){showInfo(sys.dataset.systemState,sys.querySelector("small").textContent,sys.dataset.systemState==="Error"?"!":"✓");return;}
    const action=e.target.closest("[data-action]")?.dataset.action;if(!action)return;
    if(action==="back"){if(pane)goBackPane(pane);else goBack();}
    else if(action==="sign-out"){state.route="signin";state.stack=[];state.splitRoutes={primary:"home",secondary:"home"};state.splitStacks={primary:[],secondary:[]};state.activePane="primary";state.modal=null;render();announce("Signed out securely");}
    else if(action==="close-modal") {state.modal=null;render();}
    else if(action==="filters")showInfo("Transaction filters","Date, category, amount and status filters are ready to apply.","≡");
    else if(action==="category")toast("Category editor opened");
    else if(action==="toggle-card-lock") {state.modal={type:"confirm-lock",title:"Card lock"};render();}
    else if(action==="confirm-card-lock") {state.cardLocked=!state.cardLocked;state.modal=null;render();toast(state.cardLocked?"Mastercard locked":"Mastercard unlocked");}
    else if(action==="toggle-debit-lock") {state.debitLocked=!state.debitLocked;render();toast(state.debitLocked?"Debit card locked":"Debit card unlocked");}
    else if(action==="verify-otp"){const input=root.querySelector("#otp");if(input.value==="284719")navigate("home");else{root.querySelector("#otp-error").hidden=false;input.setAttribute("aria-invalid","true");input.focus();}}
    else if(action==="save-recipient"){state.selectedRecipient="maya";open("interac/amount");toast("Recipient saved");}
    else if(action==="save-payee"){state.selectedPayee="power";open("bills/payment");toast("Payee saved");}
    else if(action==="read-all"){D.notifications.forEach(n=>state.noticeRead.add(n.id));render();}
    else if(action==="send-chat"){const input=root.querySelector("#chat-message");if(input.value.trim()){showInfo("Message sent","A support specialist will respond in this secure conversation.","✓");}}
    else if(action==="password-reset")showInfo("Check your email","Reset instructions were sent to your verified address.");
    else if(action==="report-submitted")showInfo("Report received","Your card remains active. A specialist will review the transaction shortly.");
    else if(action==="document-preview")showInfo("Document preview","A secure PDF preview would open with download and save-offline actions.","▤");
    else if(action==="lost-card")showInfo("Card support","Your card can be locked immediately while a replacement is arranged.","!");
    else if(action==="fraud")showInfo("Fraud support","A specialist is available now. Your account remains protected.","!");
    else if(action==="deposit-demo")showInfo("Camera simulation","Cheque capture is represented without requesting device-camera access.","▣");
    else showInfo("Ready","This interactive control is represented in the portfolio prototype.");
  });
  root.addEventListener("input",e=>{const type=e.target.dataset.input;if(type==="transfer-amount")state.transferAmount=e.target.value;if(type==="bill-amount")state.billAmount=e.target.value;if(type==="card-payment")state.cardPayment=e.target.value;if(type==="order-amount")state.orderAmount=e.target.value;if(type==="global-search"){state.search=e.target.value;const pos=e.target.selectionStart;render();const input=root.querySelector('[data-input="global-search"]');input?.focus();input?.setSelectionRange(pos,pos);}});
  root.addEventListener("change",e=>{if(e.target.dataset.input==="recipient-select")state.selectedRecipient=e.target.value;});
  window.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"&&!(e.target instanceof HTMLInputElement)&&!(e.target instanceof HTMLTextAreaElement)){if(state.device==="split"&&!isAuthRoute())goBackPane(state.activePane);else goBack();}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();if(state.device==="split"&&!isAuthRoute())navigatePane(state.activePane,"search");else navigate("search");}if(e.key.toLowerCase()==="r"&&!(e.metaKey||e.ctrlKey)&&!(e.target instanceof HTMLInputElement)&&!(e.target instanceof HTMLTextAreaElement)){document.querySelector("#rotate-demo")?.click();}});
  window.addEventListener("resize",updateScale);

  render();
})();
