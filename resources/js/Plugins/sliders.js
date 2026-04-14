// resources/js/plugins/sliders.js

let initializationTimeout = null;

function initSlick(el, options) {
    if (!window.jQuery || !jQuery.fn.slick) {
        console.warn("jQuery or Slick not available");
        return false;
    }

    const $ = window.jQuery;
    const $el = typeof el === "string" ? $(el) : $(el);

    if (!$el.length) {
        console.warn("Element not found:", el);
        return false;
    }

    // Destroy existing slick instance if any
    if ($el.hasClass("slick-initialized")) {
        try {
            $el.slick("unslick");
            $el.removeClass("slick-initialized slick-slider");
        } catch (e) {
            console.warn("Error unslicking:", e);
        }
    }

    // Make sure the element is visible before initializing
    if ($el.is(":hidden")) {
        console.warn("Element is hidden, waiting...");
        return false;
    }

    // Initialize slick
    try {
        $el.slick(options);
        return true;
    } catch (e) {
        return false;
    }
}

// Export destroy function to clean up sliders
export function destroySliders() {
    if (!window.jQuery || !jQuery.fn.slick) return;

    const $ = window.jQuery;

    // Destroy all slick sliders on the page
    $(".slick-initialized").each(function () {
        try {
            $(this).slick("unslick");
            $(this).removeClass("slick-initialized slick-slider");
        } catch (e) {
            console.warn("Error destroying slider:", e);
        }
    });
}

export function initSliders() {
    // Clear any pending initialization
    if (initializationTimeout) {
        clearTimeout(initializationTimeout);
    }

    // Wait for DOM to be ready
    initializationTimeout = setTimeout(() => {
        // Check if jQuery and Slick are available
        if (!window.jQuery || !jQuery.fn.slick) {
            return;
        }

        // Category slider
        const categorySlider = document.querySelector(".category-slider");
        if (categorySlider && categorySlider.children.length > 0) {
            initSlick(".category-slider", {
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                autoplay: true,
                arrows: true,
                dots: false,
                prevArrow:
                    '<span class="slick-prev"><i class="feather-icon icon-chevron-left"></i></span>',
                nextArrow:
                    '<span class="slick-next"><i class="feather-icon icon-chevron-right"></i></span>',
                responsive: [
                    { breakpoint: 1400, settings: { slidesToShow: 4 } },
                    { breakpoint: 820, settings: { slidesToShow: 2 } },
                ],
            });
        }

        // Team slider
        const teamSlider = document.querySelector(".team-slider");
        if (teamSlider && teamSlider.children.length > 0) {
            initSlick(".team-slider", {
                slidesToShow: 5,
                autoplay: true,
                arrows: true,
            });
        }

        // Hero slider
        const heroSlider = document.querySelector(".hero-slider");
        if (heroSlider && heroSlider.children.length > 0) {
            initSlick(".hero-slider", {
                slidesToShow: 1,
                autoplay: true,
                dots: true,
                arrows: false,
            });
        }

        // Slider 8 columns
        const eightColumnSliders =
            document.querySelectorAll(".slider-8-columns");
        if (eightColumnSliders.length > 0) {
            eightColumnSliders.forEach((el) => {
                if (el.children.length > 0) {
                    initSlick(`#${el.id}`, {
                        slidesToShow: 8,
                        autoplay: true,
                        arrows: true,
                        appendArrows: `#${el.id}-arrows`,
                    });
                }
            });
        }

        // Product slider
        const productSlider = document.querySelector(".product-slider");
        if (productSlider && productSlider.children.length > 0) {
            initSlick(".product-slider", {
                slidesToShow: 5,
                autoplay: true,
                arrows: true,
            });
        }

        // Linked sliders
        const sliderFor = document.querySelector(".slider-for");
        const sliderNav = document.querySelector(".slider-nav");

        if (
            sliderFor &&
            sliderNav &&
            sliderFor.children.length > 0 &&
            sliderNav.children.length > 0
        ) {
            initSlick(".slider-for", {
                slidesToShow: 1,
                fade: true,
                arrows: false,
                asNavFor: ".slider-nav",
            });

            initSlick(".slider-nav", {
                slidesToShow: 4,
                focusOnSelect: true,
                asNavFor: ".slider-for",
            });
        }
    }, 200);
}
