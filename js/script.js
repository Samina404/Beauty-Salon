$(document).ready(function() {
  // Navbar scroll effect
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

  // Load Services Data
  let allServices = [];

  function loadServices() {
    $.ajax({
      url: 'data/services.json',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        allServices = data;
        renderServices(allServices);
        setupFilters(allServices);
      },
      error: function(err) {
        console.error('Error loading services:', err);
      }
    });
  }

  function renderServices(services) {
    const container = $('#services-container');
    container.empty();

    if (services.length === 0) {
      container.append('<div class="col-12 text-center py-5"><h5>No services found matching your criteria.</h5></div>');
      return;
    }

    services.forEach(service => {
      const card = `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card treatment-card h-100">
            <img src="${service.image}" class="card-img-top treatment-img" alt="${service.name}">
            <div class="card-body text-center p-4 d-flex flex-column">
              <h5 class="card-title font-heading mb-3">${service.name}</h5>
              <p class="card-text small mb-3 flex-grow-1">${service.description}</p>
              <div class="treatment-price mb-3">$${service.price}</div>
              <button class="btn btn-primary-custom w-100 btn-sm mt-auto" onclick="bookService(${service.id})">Book now</button>
            </div>
          </div>
        </div>
      `;
      container.append(card);
    });
  }

  function setupFilters(services) {
    const categories = ['All', ...new Set(services.map(s => s.category))];
    const filterContainer = $('#filter-buttons');
    filterContainer.empty();

    categories.forEach(cat => {
      const btn = `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat}">${cat}</button>`;
      filterContainer.append(btn);
    });

    $('.filter-btn').on('click', function() {
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');
      filterAndSearch();
    });
  }

  $('#search-input').on('input', function() {
    filterAndSearch();
  });

  function filterAndSearch() {
    const activeFilter = $('.filter-btn.active').data('filter') || 'All';
    const searchQuery = $('#search-input').val().toLowerCase();

    const filtered = allServices.filter(service => {
      const matchesFilter = activeFilter === 'All' || service.category === activeFilter;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery) || service.description.toLowerCase().includes(searchQuery);
      return matchesFilter && matchesSearch;
    });

    renderServices(filtered);
  }

  // Load initial data
  loadServices();

  // Basic Form Validation
  $('#contact-form').on('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    
    $(this).find('input[required], textarea[required]').each(function() {
      if (!$(this).val()) {
        $(this).addClass('is-invalid');
        isValid = false;
      } else {
        $(this).removeClass('is-invalid');
      }
    });

    // Email validation specifically
    const emailField = $(this).find('input[type="email"]');
    const emailPattern = /^[a-zA-Z0-Exp]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailField.val() && !emailPattern.test(emailField.val())) {
        emailField.addClass('is-invalid');
        isValid = false;
    }

    if (isValid) {
      alert('Thank you for contacting us! We will get back to you soon.');
      $(this).trigger('reset');
    }
  });

  $('#contact-form input, #contact-form textarea').on('input', function() {
    $(this).removeClass('is-invalid');
  });
  // ScrollSpy for Navbar
  const sections = $('section');
  const navLinks = $('.nav-link');

  $(window).on('scroll', function() {
    let current = '';
    const scrollPos = $(window).scrollTop() + 100;

    sections.each(function() {
      const sectionTop = $(this).offset().top;
      const sectionHeight = $(this).outerHeight();
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = $(this).attr('id');
      }
    });

    navLinks.removeClass('active');
    if (current) {
      $(`.nav-link[href="#${current}"]`).addClass('active');
    }
  });

  // IntersectonObserver for fade-up animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add initial fade-up class to elements
  $('section h2, section h1, .about-subtitle, .treatment-card, .testimonial-card, #contact-form').addClass('fade-up');
  
  $('.fade-up').each(function() {
    observer.observe(this);
  });
});

function bookService(id) {
  alert('Booking process initiated for service ID: ' + id);
}
