(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Logins removed - public portal
    window.handleHeaderLogout = function () {};
    function updateHeaderAuthState() {}

    // Load centralized header component into #site-header
    if ($('#site-header').length > 0) {
        $('#site-header').load('header.html?v=20261104', function () {
            // Highlight active navigation link
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            $('#main-nav-links a').each(function () {
                const href = $(this).attr('href');
                if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
                    $(this).addClass('active');
                } else if (href && href !== 'index.html' && href.indexOf('#') !== 0) {
                    $(this).removeClass('active');
                }
            });

            if (window.i18nEngine && typeof window.i18nEngine.setLanguage === 'function') {
                window.i18nEngine.setLanguage(window.i18nEngine.getCurrentLang());
            }
            document.dispatchEvent(new Event("header:loaded"));
        });
    }

    // Load centralized footer component into #site-footer
    if ($('#site-footer').length > 0) {
        $('#site-footer').load('footer.html?v=20261104', function () {
            if (window.i18nEngine && typeof window.i18nEngine.setLanguage === 'function') {
                window.i18nEngine.setLanguage(window.i18nEngine.getCurrentLang());
            }
        });
    }
    
    // Initiate WOW.js safely
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // Facts counter safely
    if ($.fn.counterUp && $('[data-toggle="counter-up"]').length > 0) {
        $('[data-toggle="counter-up"]').counterUp({
            delay: 10,
            time: 2000
        });
    }

    var backTop = document.querySelector(".back-to-top");
    var sentinel = document.getElementById("main-content") || document.querySelector(".hero-banner, .bg-header, .bg-district-header, .bg-contact-header");
    if (backTop && sentinel && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            if (entries[0] && entries[0].isIntersecting) {
                backTop.classList.remove("is-visible");
            } else {
                backTop.classList.add("is-visible");
            }
        }, { threshold: 0 });
        io.observe(sentinel);
    } else if (backTop) {
        backTop.classList.add("is-visible");
    }
    $(".back-to-top").on("click", function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Testimonials carousel safely
    if ($.fn.owlCarousel && $(".testimonial-carousel").length > 0) {
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            dots: true,
            loop: true,
            center: true,
            responsive: {
                0:{
                    items:1
                },
                576:{
                    items:1
                }
            }
        });
    }

    // Vendor carousel safely
    if ($.fn.owlCarousel && $('.vendor-carousel').length > 0) {
        $('.vendor-carousel').owlCarousel({
            loop: true,
            margin: 45,
            dots: false,
            autoplay: true,
            smartSpeed: 1000,
            responsive: {
                0:{
                    items:2
                },
                576:{
                    items:4
                },
                768:{
                    items:6
                }
            }
        });
    }

})(jQuery);
