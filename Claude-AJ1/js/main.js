/**
 * Anodea Judith Website Prototype v2
 * Main JavaScript File
 */

(function() {
    'use strict';

    // Mobile Navigation Toggle
    function initMobileNav() {
        var toggle = document.querySelector('.mobile-menu-toggle');
        var nav = document.querySelector('.main-nav');

        if (!toggle || !nav) return;

        toggle.addEventListener('click', function() {
            var isOpen = nav.classList.contains('is-open');
            nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', !isOpen);
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    }

    // Events Loading
    function formatDate(dateString) {
        var date = new Date(dateString);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
            month: months[date.getMonth()],
            day: date.getDate(),
            year: date.getFullYear()
        };
    }

    function escapeHTML(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function createEventHTML(event) {
        var date = formatDate(event.date);
        var html = '<article class="event-item">' +
            '<div class="event-date">' +
                '<span class="event-date-month">' + date.month + '</span>' +
                '<span class="event-date-day">' + date.day + '</span>' +
                '<span class="event-date-year">' + date.year + '</span>' +
            '</div>' +
            '<div class="event-details">' +
                '<h3 class="event-title">' + escapeHTML(event.title) + '</h3>' +
                '<p class="event-location">' + escapeHTML(event.location) + '</p>' +
                '<p class="event-description">' + escapeHTML(event.description) + '</p>';
        if (event.link) {
            html += '<a href="' + escapeHTML(event.link) + '" class="btn btn--secondary" target="_blank" rel="noopener">Learn More & Register</a>';
        }
        html += '</div></article>';
        return html;
    }

    function createEventPreviewHTML(event) {
        var date = formatDate(event.date);
        var html = '<div class="event-item" style="background-color: rgba(255,255,255,0.05);">' +
            '<div class="event-date" style="background-color: rgba(212, 168, 75, 0.2);">' +
                '<span class="event-date-month">' + date.month + '</span>' +
                '<span class="event-date-day">' + date.day + '</span>' +
                '<span class="event-date-year">' + date.year + '</span>' +
            '</div>' +
            '<div class="event-details">' +
                '<h3 class="event-title" style="color: #e8c875;">' + escapeHTML(event.title) + '</h3>' +
                '<p class="event-location" style="color: rgba(255,255,255,0.7);">' + escapeHTML(event.location) + '</p>';
        if (event.link) {
            html += '<a href="' + escapeHTML(event.link) + '" class="btn btn--secondary" target="_blank" rel="noopener">Learn More</a>';
        }
        html += '</div></div>';
        return html;
    }

    function loadEvents() {
        var eventsList = document.getElementById('events-list');
        var homeEventsPreview = document.getElementById('home-events-preview');
        var noEventsMessage = document.getElementById('no-events');

        fetch('data/events.json')
            .then(function(response) {
                if (!response.ok) throw new Error('Could not load events');
                return response.json();
            })
            .then(function(data) {
                var events = data.events || [];
                var now = new Date();
                now.setHours(0, 0, 0, 0);

                var upcomingEvents = events.filter(function(event) {
                    return new Date(event.date) >= now;
                }).sort(function(a, b) {
                    return new Date(a.date) - new Date(b.date);
                });

                if (eventsList) {
                    if (upcomingEvents.length === 0) {
                        eventsList.style.display = 'none';
                        if (noEventsMessage) noEventsMessage.style.display = 'block';
                    } else {
                        eventsList.innerHTML = '<ul class="events-list" style="list-style: none; padding: 0;">' +
                            upcomingEvents.map(createEventHTML).join('') + '</ul>';
                    }
                }

                if (homeEventsPreview) {
                    if (upcomingEvents.length === 0) {
                        homeEventsPreview.innerHTML = '<p class="text-center" style="color: rgba(255,255,255,0.7);">No upcoming events scheduled. Check back soon!</p>';
                    } else {
                        homeEventsPreview.innerHTML = upcomingEvents.slice(0, 3).map(createEventPreviewHTML).join('');
                    }
                }
            })
            .catch(function(error) {
                console.error('Error loading events:', error);
                if (eventsList) {
                    eventsList.innerHTML = '<p class="text-center" style="color: #666;">Unable to load events. Please check back later.</p>';
                }
                if (homeEventsPreview) {
                    homeEventsPreview.innerHTML = '<p class="text-center" style="color: rgba(255,255,255,0.7);">Unable to load events.</p>';
                }
            });
    }

    // Form Handling (Visual only)
    function initForms() {
        var contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! (This is a prototype - the form does not actually submit.)');
            });
        }
    }

    // Initialize
    function init() {
        initMobileNav();
        loadEvents();
        initForms();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
