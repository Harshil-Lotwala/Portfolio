// A previously used home link left #main in the URL, causing browsers to
// restore the page below the beginning of the hero after a refresh.
if (window.location.hash === '#main') {
  try {
    window.history.replaceState(null, '', window.location.href.replace(/#main$/, ''));
  } catch (_) {
    // Scrolling still restores the intended start position if history is unavailable.
  }
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
}

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

function closeMenu() {
  nav?.classList.remove('open');
  menuButton?.classList.remove('active');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(max-width: 860px)').addEventListener('change', event => { if (!event.matches) closeMenu(); });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px -20px' });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

function activate(container, panelSelector, name) {
  container.querySelectorAll(panelSelector).forEach(panel => {
    panel.classList.toggle('is-active', panel.dataset[Object.keys(panel.dataset)[0]] === name);
  });
}

function flash(element, message) {
  if (!element) return;
  element.textContent = message;
  element.classList.add('show');
  window.clearTimeout(element._hideTimer);
  element._hideTimer = window.setTimeout(() => element.classList.remove('show'), 2300);
}

// Switch between the two DAL Connect device experiences without duplicating the project card.
document.querySelectorAll('[data-device-switch]').forEach(button => {
  button.addEventListener('click', () => {
    const showcase = button.closest('.device-showcase');
    const selected = button.dataset.deviceSwitch;
    showcase.querySelectorAll('[data-device-switch]').forEach(control => {
      const active = control.dataset.deviceSwitch === selected;
      control.classList.toggle('active', active);
      control.setAttribute('aria-pressed', String(active));
    });
    showcase.querySelectorAll('[data-device-view]').forEach(view => {
      view.classList.toggle('is-active', view.dataset.deviceView === selected);
    });
  });
});

// DAL Connect: confirmation, post, reminder, and schedule states.
const dal = document.querySelector('[data-demo="dal"]');
if (dal) {
  const panels = [...dal.querySelectorAll('[data-dal-panel]')];
  const tabs = [...dal.querySelectorAll('[data-dal-nav]')];
  const toast = dal.querySelector('[data-dal-toast]');
  const showDal = name => {
    panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.dalPanel === name));
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.dalNav === name || (name === 'post' && tab.dataset.dalNav === 'group')));
  };
  tabs.forEach(tab => tab.addEventListener('click', () => showDal(tab.dataset.dalNav)));
  dal.querySelectorAll('[data-dal-route]').forEach(button => button.addEventListener('click', () => showDal(button.dataset.dalRoute)));
  dal.querySelector('[data-dal-join]')?.addEventListener('click', event => {
    event.currentTarget.textContent = '✓ Joined';
    event.currentTarget.disabled = true;
    event.currentTarget.style.background = '#197641';
    dal.querySelector('[data-dal-post]').hidden = false;
    flash(toast, 'Success — you joined CS Study Buddies');
  });
  dal.querySelector('[data-dal-post]')?.addEventListener('click', () => showDal('post'));
  dal.querySelector('[data-dal-back]')?.addEventListener('click', () => showDal('group'));
  dal.querySelector('[data-dal-publish]')?.addEventListener('click', () => {
    const field = dal.querySelector('[data-dal-panel="post"] textarea');
    if (!field.value.trim()) { flash(toast, 'Write something before publishing'); field.focus(); return; }
    showDal('group');
    flash(toast, 'Post published to the group');
    field.value = '';
  });
  dal.querySelector('[data-reminder-done]')?.addEventListener('click', event => { event.currentTarget.textContent = '✓ You’re here'; event.currentTarget.disabled = true; flash(toast, 'Reminder completed'); });
  dal.querySelector('[data-reminder-dismiss]')?.addEventListener('click', () => { showDal('group'); flash(toast, 'Reminder dismissed'); });
  dal.querySelectorAll('[data-dal-message]').forEach(button => button.addEventListener('click', () => flash(toast, button.dataset.dalMessage)));
  const optionsButton = dal.querySelector('[data-dal-options]');
  const optionsMenu = dal.querySelector('[data-dal-options-menu]');
  optionsButton?.addEventListener('click', () => {
    optionsMenu.hidden = !optionsMenu.hidden;
    optionsButton.setAttribute('aria-expanded', String(!optionsMenu.hidden));
  });
  dal.querySelector('[data-dal-leave]')?.addEventListener('click', () => {
    const join = dal.querySelector('[data-dal-join]');
    join.textContent = 'Join Group'; join.disabled = false; join.style.background = '';
    dal.querySelector('[data-dal-post]').hidden = true;
    optionsMenu.hidden = true;
    flash(toast, 'You left the group');
  });
  const locationButton = dal.querySelector('[data-dal-location]');
  const locationDetail = dal.querySelector('[data-dal-location-detail]');
  locationButton?.addEventListener('click', () => {
    locationDetail.hidden = !locationDetail.hidden;
    locationButton.setAttribute('aria-expanded', String(!locationDetail.hidden));
    locationButton.textContent = locationDetail.hidden ? '⌖ Show location' : '⌖ Hide location';
  });
  dal.querySelector('[data-dal-reminder-form]')?.addEventListener('submit', event => { event.preventDefault(); showDal('reminders'); flash(toast, 'Reminder saved'); });
  dal.querySelector('[data-dal-event-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    dal.querySelector('[data-dal-created-event]').innerHTML = '<button class="event-card" data-dal-message="Portfolio review details opened"><small>NEW EVENT</small><h4>Portfolio review</h4><p>Mona Campbell</p></button>';
    dal.querySelector('[data-dal-created-event] button').addEventListener('click', () => flash(toast, 'Portfolio review details opened'));
    showDal('schedule'); flash(toast, 'Event added to the schedule');
  });
  dal.querySelectorAll('.week-row button').forEach(button => button.addEventListener('click', () => {
    dal.querySelectorAll('.week-row button').forEach(day => day.classList.remove('active'));
    button.classList.add('active');
    flash(toast, `${button.textContent.trim()} selected`);
  }));
}

// Watch: every visible control has a complete response.
const watch = document.querySelector('[data-demo="watch"]');
if (watch) {
  const panels = [...watch.querySelectorAll('[data-watch-panel]')];
  const notice = watch.querySelector('[data-watch-notice]');
  let selectedLibrary = 'Killam Library';
  let selectedZone = 'A';
  let selectedTime = '2:00 PM';
  const showWatch = name => panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.watchPanel === name));
  watch.querySelectorAll('[data-watch-route]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.watchRoute === 'success') {
      watch.querySelector('[data-watch-success-location]').textContent = `${selectedLibrary.replace(' Library','')} · Room ${selectedZone}`;
      watch.querySelector('[data-watch-success-time]').textContent = selectedTime;
      watch.querySelector('[data-watch-calendar-time]').textContent = selectedTime.replace(' AM','').replace(' PM','');
      watch.querySelector('[data-watch-calendar-location]').textContent = `${selectedLibrary.replace(' Library','')} · Room ${selectedZone}`;
      watch.querySelector('[data-watch-booking]').hidden = false;
    }
    showWatch(button.dataset.watchRoute);
  }));
  watch.querySelectorAll('[data-watch-library]').forEach(button => button.addEventListener('click', () => {
    selectedLibrary = button.dataset.watchLibrary;
    watch.querySelector('[data-watch-library-label]').textContent = selectedLibrary.toUpperCase();
    showWatch('zones');
  }));
  watch.querySelectorAll('[data-watch-zone]').forEach(button => button.addEventListener('click', () => {
    selectedZone = button.dataset.watchZone;
    watch.querySelector('[data-watch-room-label]').textContent = `ROOM ${selectedZone}`;
    showWatch('slots');
  }));
  watch.querySelectorAll('[data-watch-time]').forEach(button => button.addEventListener('click', () => {
    selectedTime = button.dataset.watchTime;
    watch.querySelector('[data-watch-confirm-room]').textContent = `Room ${selectedZone}`;
    watch.querySelector('[data-watch-confirm-time]').textContent = selectedTime;
    showWatch('confirm');
  }));
  watch.querySelectorAll('[data-watch-chat]').forEach(button => button.addEventListener('click', () => {
    watch.querySelector('[data-watch-chat-name]').textContent = button.dataset.watchChat;
    showWatch('chat');
  }));
  watch.querySelector('[data-watch-send]')?.addEventListener('click', () => {
    const field = watch.querySelector('[data-watch-chat-input]');
    if (!field.value.trim()) { field.focus(); flash(notice, 'Write a message first'); return; }
    flash(notice, `Message sent to ${watch.querySelector('[data-watch-chat-name]').textContent}`);
    field.value = '';
  });
  watch.querySelector('[data-watch-booking]')?.addEventListener('click', () => flash(notice, 'Study-space booking details opened'));
  watch.querySelectorAll('[data-watch-message]').forEach(button => button.addEventListener('click', () => flash(notice, button.dataset.watchMessage)));
}

// FreshLocal: high-fidelity Figma-inspired browsing and a persistent multi-product cart.
const market = document.querySelector('[data-demo="market"]');
if (market) {
  const imageRoot = 'https://images.unsplash.com/';
  const products = {
    strawberries: { name: 'Organic Strawberries', farm: 'Green Valley Farm', price: 4.99, unit: '/ lb', image: `${imageRoot}photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=800&q=80`, description: 'Premium organic strawberries, handpicked at peak ripeness for a sweet, fresh flavour.' },
    tomatoes: { name: 'Cherry Tomatoes', farm: 'Green Valley Farm', price: 5.99, unit: '/ lb', image: `${imageRoot}photo-1758487405872-8e179dfe703e?auto=format&fit=crop&w=800&q=80`, description: 'Bright local tomatoes harvested for salads, sauces, and everyday cooking.' },
    vegetables: { name: 'Mixed Vegetables', farm: 'Sunrise Organic', price: 7.49, unit: '/ bundle', image: `${imageRoot}photo-1554223745-ad862492c213?auto=format&fit=crop&w=800&q=80`, description: 'A seasonal bundle of fresh vegetables selected from the week’s harvest.' },
    lettuce: { name: 'Fresh Lettuce', farm: 'Valley Greens', price: 3.99, unit: '/ head', image: `${imageRoot}photo-1741515042603-70545daeb0c4?auto=format&fit=crop&w=800&q=80`, description: 'Crisp local greens grown for a clean flavour and satisfying crunch.' },
    heirloom: { name: 'Heirloom Tomatoes', farm: 'Green Valley Farm', price: 6.99, unit: '/ lb', image: `${imageRoot}photo-1758487405872-8e179dfe703e?auto=format&fit=crop&w=800&q=80`, description: 'Colourful heirloom tomatoes with a rich flavour, available for a limited time.' },
    carrots: { name: 'Organic Carrots', farm: 'Riverside Farm', price: 4.49, unit: '/ bunch', image: `${imageRoot}photo-1554223745-ad862492c213?auto=format&fit=crop&w=800&q=80`, description: 'Sweet organic carrots grown nearby and sold by the bunch.' },
    peppers: { name: 'Bell Peppers', farm: 'Valley Greens', price: 5.49, unit: '/ lb', image: `${imageRoot}photo-1554223745-ad862492c213?auto=format&fit=crop&w=800&q=80`, description: 'Crisp mixed bell peppers from a nearby greenhouse.' }
  };
  const cart = new Map();
  const panels = [...market.querySelectorAll('[data-market-panel]')];
  const tabs = [...market.querySelectorAll('[data-market-tab]')];
  const toast = market.querySelector('[data-market-toast]');
  const cartItems = market.querySelector('[data-market-cart-items]');
  let currentProduct = 'strawberries';
  let detailQuantity = 1;
  let fulfilment = 'pickup';

  const money = value => `$${value.toFixed(2)}`;
  const cartCount = () => [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = () => [...cart.entries()].reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  const showMarket = name => {
    panels.forEach(panel => {
      const active = panel.dataset.marketPanel === name;
      panel.classList.toggle('is-active', active);
      if (active) panel.scrollTop = 0;
    });
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.marketTab === name));
  };
  const updateDetail = () => {
    const product = products[currentProduct];
    detailQuantity = 1;
    market.querySelector('[data-market-detail-image]').src = product.image;
    market.querySelector('[data-market-detail-image]').alt = product.name;
    market.querySelector('[data-market-detail-name]').textContent = product.name;
    market.querySelector('[data-market-detail-price]').textContent = money(product.price);
    market.querySelector('[data-market-detail-unit]').textContent = product.unit;
    market.querySelector('[data-market-detail-farm]').textContent = product.farm;
    market.querySelector('[data-market-detail-description]').textContent = product.description;
    market.querySelector('[data-market-detail-count]').textContent = '1';
    market.querySelector('[data-market-add]').textContent = `Add to Cart · ${money(product.price)}`;
  };
  const renderCart = () => {
    const count = cartCount();
    market.querySelectorAll('[data-cart-count]').forEach(element => element.textContent = String(count));
    market.querySelector('[data-market-cart-empty]').hidden = count > 0;
    market.querySelector('[data-market-cart-filled]').hidden = count === 0;
    cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
      const product = products[id];
      return `<article class="fresh-cart-row" data-cart-product="${id}"><img src="${product.image}" alt=""><div><b>${product.name}</b><small>${product.farm}</small><em>${money(product.price)} ${product.unit}</em></div><button data-cart-remove aria-label="Remove ${product.name}">×</button><div class="fresh-cart-quantity"><button data-cart-change="minus" aria-label="Decrease ${product.name}">−</button><b>${quantity}</b><button data-cart-change="plus" aria-label="Increase ${product.name}">＋</button></div><strong>${money(product.price * quantity)}</strong></article>`;
    }).join('');
    const sub = subtotal();
    market.querySelector('[data-market-subtotal]').textContent = money(sub);
    market.querySelector('[data-market-total]').textContent = money(sub + 2.99);
    market.querySelector('[data-market-checkout-total]').textContent = money(sub + (fulfilment === 'delivery' ? 2.99 : 0));
  };
  const applyBrowseFilter = (filter = 'all', query = '') => {
    let visible = 0;
    market.querySelectorAll('.fresh-grid-product').forEach(card => {
      const id = card.dataset.marketOpenProduct;
      const tagMatch = filter === 'all' || card.dataset.tags.includes(filter);
      const queryMatch = !query || `${products[id].name} ${products[id].farm}`.toLowerCase().includes(query.toLowerCase());
      card.hidden = !(tagMatch && queryMatch);
      if (!card.hidden) visible += 1;
    });
    market.querySelector('[data-market-result-count]').textContent = String(visible);
    market.querySelector('[data-market-empty]').hidden = visible > 0;
  };

  market.querySelectorAll('[data-market-route]').forEach(button => button.addEventListener('click', () => showMarket(button.dataset.marketRoute)));
  tabs.forEach(tab => tab.addEventListener('click', () => showMarket(tab.dataset.marketTab)));
  market.querySelectorAll('[data-market-open-product]').forEach(button => button.addEventListener('click', () => {
    currentProduct = button.dataset.marketOpenProduct;
    updateDetail();
    showMarket('product');
  }));
  market.querySelectorAll('[data-market-filter]').forEach(button => button.addEventListener('click', () => {
    market.querySelectorAll('[data-market-filter]').forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');
    applyBrowseFilter(button.dataset.marketFilter);
  }));
  market.querySelectorAll('[data-market-category]').forEach(button => button.addEventListener('click', () => {
    showMarket('browse');
    const category = button.dataset.marketCategory;
    if (category === 'vegetables') applyBrowseFilter('all');
    else applyBrowseFilter('all', category === 'fruits' ? 'strawberr' : category);
  }));
  market.querySelector('[data-market-search]')?.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    showMarket('browse');
    applyBrowseFilter('all', event.currentTarget.value.trim());
  });
  market.querySelectorAll('[data-market-detail-qty]').forEach(button => button.addEventListener('click', () => {
    detailQuantity = Math.max(1, detailQuantity + (button.dataset.marketDetailQty === 'plus' ? 1 : -1));
    market.querySelector('[data-market-detail-count]').textContent = String(detailQuantity);
    market.querySelector('[data-market-add]').textContent = `Add to Cart · ${money(products[currentProduct].price * detailQuantity)}`;
  }));
  market.querySelector('[data-market-add]')?.addEventListener('click', () => {
    cart.set(currentProduct, (cart.get(currentProduct) || 0) + detailQuantity);
    renderCart();
    flash(toast, `${products[currentProduct].name} added to your cart`);
    showMarket('cart');
  });
  cartItems?.addEventListener('click', event => {
    const button = event.target.closest('button');
    const row = event.target.closest('[data-cart-product]');
    if (!button || !row) return;
    const id = row.dataset.cartProduct;
    if (button.hasAttribute('data-cart-remove')) cart.delete(id);
    if (button.dataset.cartChange === 'plus') cart.set(id, cart.get(id) + 1);
    if (button.dataset.cartChange === 'minus') {
      const next = cart.get(id) - 1;
      if (next > 0) cart.set(id, next); else cart.delete(id);
    }
    renderCart();
  });
  market.querySelector('[data-market-apply]')?.addEventListener('click', () => {
    const promo = market.querySelector('[data-market-promo]');
    flash(toast, promo.value.trim() ? 'Promo code applied' : 'Enter a promo code first');
  });
  market.querySelectorAll('[data-market-fulfilment]').forEach(button => button.addEventListener('click', () => {
    fulfilment = button.dataset.marketFulfilment;
    market.querySelectorAll('[data-market-fulfilment]').forEach(option => option.classList.toggle('active', option === button));
    market.querySelector('[data-market-address-label]').textContent = fulfilment === 'delivery' ? 'Delivery Address' : 'Pickup Location';
    market.querySelector('[data-market-address]').textContent = fulfilment === 'delivery' ? 'Home · Halifax, NS' : 'Downtown Farmers Market';
    renderCart();
  }));
  market.querySelector('[data-market-place]')?.addEventListener('click', () => {
    if (!cartCount()) { showMarket('cart'); flash(toast, 'Add products before checking out'); return; }
    const time = market.querySelector('[data-market-time]').value;
    market.querySelector('[data-market-confirm-copy]').textContent = fulfilment === 'delivery' ? `Delivery scheduled for ${time}.` : `Pickup scheduled for ${time} at Downtown Farmers Market.`;
    showMarket('confirmation');
  });
  market.querySelector('[data-market-favourite]')?.addEventListener('click', event => { event.currentTarget.textContent = event.currentTarget.textContent === '♡' ? '♥' : '♡'; flash(toast, 'Saved products updated'); });
  market.querySelector('[data-market-read]')?.addEventListener('click', event => {
    market.querySelectorAll('.fresh-alert').forEach(alert => alert.classList.remove('unread'));
    event.currentTarget.textContent = 'All read';
    event.currentTarget.classList.add('is-complete');
    event.currentTarget.disabled = true;
    event.currentTarget.setAttribute('aria-label', 'All notifications are read');
    flash(toast, 'Notifications marked as read');
  });
  market.querySelector('[data-market-save]')?.addEventListener('click', () => flash(toast, 'Preferences saved'));
  market.querySelectorAll('[data-market-message]').forEach(button => button.addEventListener('click', () => flash(toast, button.dataset.marketMessage)));
  updateDetail();
  renderCart();
}

// Portfolio contact form.
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');
contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = contactForm.querySelector('button');
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = 'Sending…';
  formStatus.textContent = '';
  try {
    const response = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Submission failed');
    contactForm.reset();
    formStatus.textContent = 'Thanks — your message is on its way.';
  } catch {
    formStatus.textContent = 'Something went wrong. Please email me directly instead.';
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});
