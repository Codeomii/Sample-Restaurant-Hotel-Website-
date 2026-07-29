/**
 * AURA FINE DINING & LOUNGE - Interactive Script
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavbar();
  initMenuFilterAndSearch();
  initOfferCountdown();
  initGalleryLightbox();
  initReservationForm();
  initNewsletterForm();
  initBackToTop();
  initOrderCartCounter();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Shrink & Active ScrollSpy
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar-luxury');
  const navLinks = document.querySelectorAll('.navbar-luxury .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy highlighting
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Close mobile collapse menu on link click
  const navbarCollapse = document.getElementById('navbarNav');
  if (navbarCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. Our Menu Filter Tabs & Real-time Search
   -------------------------------------------------------------------------- */
function initMenuFilterAndSearch() {
  const filterBtns = document.querySelectorAll('.menu-tabs .nav-link');
  const menuItems = document.querySelectorAll('.menu-item-col');
  const searchInput = document.getElementById('menuSearchInput');

  let activeCategory = 'all';

  function filterMenu() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    menuItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      const itemTitle = item.querySelector('.dish-title') ? item.querySelector('.dish-title').innerText.toLowerCase() : '';
      const itemDesc = item.querySelector('.dish-desc') ? item.querySelector('.dish-desc').innerText.toLowerCase() : '';

      const matchesCategory = (activeCategory === 'all' || itemCategory === activeCategory);
      const matchesQuery = query === '' || itemTitle.includes(query) || itemDesc.includes(query);

      if (matchesCategory && matchesQuery) {
        item.style.display = 'block';
        item.classList.add('animate__animated', 'animate__fadeIn');
      } else {
        item.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterMenu();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterMenu);
  }
}

/* --------------------------------------------------------------------------
   3. Special Offers Countdown Timer & Promo Copy
   -------------------------------------------------------------------------- */
function initOfferCountdown() {
  const hoursElem = document.getElementById('cd-hours');
  const minsElem = document.getElementById('cd-mins');
  const secsElem = document.getElementById('cd-secs');

  if (!hoursElem || !minsElem || !secsElem) return;

  // Target time: Midnight tonight
  function updateTimer() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);

    const diff = midnight - now;

    if (diff <= 0) {
      hoursElem.innerText = '00';
      minsElem.innerText = '00';
      secsElem.innerText = '00';
      return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    hoursElem.innerText = hours < 10 ? '0' + hours : hours;
    minsElem.innerText = mins < 10 ? '0' + mins : mins;
    secsElem.innerText = secs < 10 ? '0' + secs : secs;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Global promo code copier
window.copyPromoCode = function(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Promo Code "${code}" copied to clipboard! Apply at reservation or checkout.`, 'success');
  }).catch(() => {
    showToast(`Promo code is: ${code}`, 'info');
  });
};

/* --------------------------------------------------------------------------
   4. Gallery Category Filter & Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-col');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  const lightboxImg = document.getElementById('lightboxModalImage');
  const lightboxTitle = document.getElementById('lightboxModalTitle');
  const lightboxCategory = document.getElementById('lightboxModalCategory');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox click trigger
  document.querySelectorAll('.gallery-item').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || 'Aura Fine Dining';
      const category = card.getAttribute('data-category-name') || 'Gallery';

      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.innerText = title;
        if (lightboxCategory) lightboxCategory.innerText = category;

        const bsModal = new bootstrap.Modal(lightboxModal);
        bsModal.show();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Reservation Form & Booking Receipt Modal
   -------------------------------------------------------------------------- */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const dateInput = document.getElementById('resDate');
  const timePills = document.querySelectorAll('.time-slot-pill');
  const selectedTimeInput = document.getElementById('selectedTimeSlot');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  // Time slot pill selection
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      timePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (selectedTimeInput) {
        selectedTimeInput.value = pill.getAttribute('data-time');
      }
    });
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('resName').value.trim();
    const email = document.getElementById('resEmail').value.trim();
    const phone = document.getElementById('resPhone').value.trim();
    const guests = document.getElementById('resGuests').value;
    const date = document.getElementById('resDate').value;
    const time = selectedTimeInput ? selectedTimeInput.value : '7:00 PM';
    const seating = document.getElementById('resSeating').value;
    const special = document.getElementById('resSpecial').value.trim();

    if (!name || !email || !phone || !date) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    // Generate random booking ID
    const bookingRef = 'AUR-' + Math.floor(100000 + Math.random() * 900000);

    // Populate modal receipt
    document.getElementById('receiptRef').innerText = bookingRef;
    document.getElementById('receiptName').innerText = name;
    document.getElementById('receiptContact').innerText = `${phone} | ${email}`;
    document.getElementById('receiptDateTime').innerText = `${date} at ${time}`;
    document.getElementById('receiptGuests').innerText = `${guests} Guest(s) (${seating})`;
    if (special) {
      document.getElementById('receiptSpecial').innerText = `Notes: "${special}"`;
      document.getElementById('receiptSpecial').style.display = 'block';
    } else {
      document.getElementById('receiptSpecial').style.display = 'none';
    }

    // Show Modal Confirmation
    const confirmationModal = new bootstrap.Modal(document.getElementById('bookingConfirmModal'));
    confirmationModal.show();

    // Reset Form
    form.reset();
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }
  });
}

/* --------------------------------------------------------------------------
   6. Newsletter Subscription Handler
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    if (emailInput && emailInput.value) {
      showToast('Thank you for subscribing to Aura VIP Dining Club!', 'success');
      emailInput.value = '';
    }
  });
}

/* --------------------------------------------------------------------------
   7. Order Cart Counter Simulation
   -------------------------------------------------------------------------- */
let orderCount = 0;
function initOrderCartCounter() {
  const addBtns = document.querySelectorAll('.btn-add-order');
  const cartBadge = document.getElementById('cartCounterBadge');

  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      orderCount++;
      if (cartBadge) {
        cartBadge.innerText = orderCount;
        cartBadge.style.display = 'inline-block';
      }
      const dishCard = btn.closest('.menu-card');
      const dishTitle = dishCard ? dishCard.querySelector('.dish-title').innerText : 'Item';

      showToast(`Added "${dishTitle}" to your dining order selection!`, 'success');
    });
  });
}

/* --------------------------------------------------------------------------
   8. Back To Top Floating Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   9. Helper Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('auraToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'auraToastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 25px;
      left: 25px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: rgba(18, 22, 32, 0.95);
    border: 1px solid var(--gold-primary, #d4af37);
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    backdrop-filter: blur(10px);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 280px;
    max-width: 400px;
    animation: slideInLeft 0.3s ease forwards;
  `;

  let icon = '<i class="bi bi-info-circle-fill text-gold"></i>';
  if (type === 'success') icon = '<i class="bi bi-check-circle-fill text-success"></i>';
  if (type === 'warning') icon = '<i class="bi bi-exclamation-triangle-fill text-warning"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
