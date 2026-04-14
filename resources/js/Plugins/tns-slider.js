// resources/js/plugins/tns-slider.js
import { tns } from "tiny-slider/src/tiny-slider";
import "tiny-slider/dist/tiny-slider.css";

let sliders = [];

export function initTnsSliders() {
    // 🔥 destroy old sliders (IMPORTANT)
    sliders.forEach((slider) => {
        if (slider && slider.destroy) {
            slider.destroy();
        }
    });
    sliders = [];

    // Product Modal Slider
    if (document.querySelectorAll(".productModal").length > 0) {
        const modalSlider = tns({
            container: "#productModal",
            items: 1,
            startIndex: 0,
            navContainer: "#productModalThumbnails",
            navAsThumbnails: true,
            autoplay: false,
            autoplayTimeout: 1500,
            swipeAngle: false,
            speed: 1500,
            controls: false,
            autoplayButtonOutput: false,
            loop: false,
        });

        sliders.push(modalSlider);
    }

    // Product Slider
    if (document.querySelectorAll(".product").length > 1) {
        const productSlider = tns({
            container: "#product",
            items: 1,
            startIndex: 0,
            navContainer: "#productThumbnails",
            navAsThumbnails: true,
            autoplay: false,
            autoplayTimeout: 1500,
            swipeAngle: false,
            speed: 1500,
            controls: false,
            autoplayButtonOutput: false,
        });

        sliders.push(productSlider);
    }
}
