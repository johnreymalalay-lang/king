function initAll() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  initServiceSelection();
  initContactServiceForm();
  initContactForm();
  initImageExpander();
  initNavToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

function initNavToggle() {
  const navToggle = document.getElementById('nav-toggle');
  const topbar = document.querySelector('.topbar');
  const mainNav = document.getElementById('main-nav');
  if (!navToggle || !topbar || !mainNav) return;

  function closeNav() {
    topbar.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function openNav() {
    topbar.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  navToggle.addEventListener('click', () => {
    if (topbar.classList.contains('open')) closeNav();
    else openNav();
  });

  // Close when a nav link is clicked (mobile)
  mainNav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 700) closeNav();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

function initServiceSelection() {
  const filterButtons = document.querySelectorAll('.service-filters .pill');
  const contactLink = document.querySelector('.services-cta a');
  if (!filterButtons.length) return;

  function updateContactLink(service) {
    if (contactLink) {
      contactLink.href = `contact.html?service=${encodeURIComponent(service)}`;
    }
  }

  function updateActive(button) {
    filterButtons.forEach((btn) => {
      btn.classList.toggle('active', btn === button);
    });

    const service = button.dataset.service || 'Private Training';
    updateContactLink(service);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.dataset.service || 'Private Training';
      updateActive(button);

      const contactUrl = new URL('contact.html', window.location.href);
      contactUrl.searchParams.set('service', service);
      window.location.assign(contactUrl.toString());
    });
  });

  const activeButton = Array.from(filterButtons).find((button) =>
    button.classList.contains('active')
  ) || filterButtons[0];

  if (activeButton) {
    updateActive(activeButton);
  }
}

function initContactServiceForm() {
  const serviceSelect = document.getElementById('service-select');
  const panels = document.querySelectorAll('.service-fields');
  if (!serviceSelect || !panels.length) return;

  function updatePanels(value) {
    panels.forEach((panel) => {
      const isVisible = panel.dataset.service === value;
      panel.classList.toggle('hidden', !isVisible);
    });
  }

  serviceSelect.addEventListener('change', (event) => {
    updatePanels(event.target.value);
  });

  const queryService = getQueryParam('service');
  if (queryService && [...serviceSelect.options].some((option) => option.value === queryService)) {
    serviceSelect.value = queryService;
  }

  updatePanels(serviceSelect.value);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('form-success');
  if (!form || !successMessage) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const service = formData.get('service') || 'Private Training';
    const name = String(formData.get('name') || 'there').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const serviceDetails = [];

    if (service === 'Private Training') {
      const privateFocus = String(formData.get('privateFocus') || '').trim();
      if (privateFocus) serviceDetails.push(`Session Focus: ${privateFocus}`);
    }

    if (service === 'Group Training') {
      const groupSize = String(formData.get('groupSize') || '').trim();
      if (groupSize) serviceDetails.push(`Group Size: ${groupSize}`);
    }

    if (service === 'Athletes Training') {
      const athleteSport = String(formData.get('athleteSport') || '').trim();
      if (athleteSport) serviceDetails.push(`Sport or Discipline: ${athleteSport}`);
    }

    const emailTo = 'johnreymalalay@gmail.com';
    const subject = `Training Inquiry - ${service}`;

    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Training Type: ${service}`,
      ...serviceDetails,
      '',
      'Message:',
      message
    ];

    const gmailComposeUrl = new URL('https://mail.google.com/mail/');
    gmailComposeUrl.searchParams.set('view', 'cm');
    gmailComposeUrl.searchParams.set('fs', '1');
    gmailComposeUrl.searchParams.set('to', emailTo);
    gmailComposeUrl.searchParams.set('su', subject);
    gmailComposeUrl.searchParams.set('body', bodyLines.join('\n'));

    window.open(gmailComposeUrl.toString(), '_blank');

    successMessage.textContent = `Thanks for your interest in ${service}. I will contact you soon.`;
    successMessage.classList.remove('hidden');

    form.reset();
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
      serviceSelect.value = 'Private Training';
    }
    initContactServiceForm();
  });
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* Image expander (right-side detail preview) */
function initImageExpander() {
  const expander = document.getElementById('image-expander');
  const expanderImg = document.getElementById('expander-img');
  const expanderCopy = document.getElementById('expander-copy');
  const closeBtn = document.getElementById('expander-close');
  if (!expander || !expanderImg) return;

  function openExpander(src, alt, htmlCopy) {
    expanderImg.src = src;
    expanderImg.alt = alt || '';
    expanderCopy.innerHTML = htmlCopy || '';
    document.body.style.overflow = 'hidden';
    expander.classList.add('open');
    expander.setAttribute('aria-hidden', 'false');
  }

  function closeExpander() {
    expander.classList.remove('open');
    expander.setAttribute('aria-hidden', 'true');
    expanderImg.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeExpander);
  expander.addEventListener('click', (e) => {
    if (e.target === expander) closeExpander();
  });

  // Attach to spotlight image and grid images
  const cards = document.querySelectorAll('.transformation-card, .transformation-spotlight');
  cards.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) return;
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      let copyHtml = '';
      // Prefer using nearby copy text
      const copy = card.querySelector('.transformation-copy, .spotlight-copy');
      if (copy) copyHtml = copy.innerHTML;
      openExpander(img.src, img.alt, copyHtml);
    });
  });
}
