import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";

import $ from "jquery";
window.$ = window.jQuery = $;

// Polyfill for $.type (deprecated in newer jQuery)
if (!$.type) {
    $.type = function (obj) {
        if (obj === null) return "null";
        if (obj === undefined) return "undefined";
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    };
}

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

import "bootstrap-icons/font/bootstrap-icons.min.css";

import "../../public/assets/libs/feather-webfont/dist/feather-icons.css";
import "../../public/assets/css/theme.min.css";
import "../../public/assets/js/theme.min.js";

import ApexCharts from "apexcharts";

// Fix for constructor issue
window.ApexCharts = ApexCharts.default || ApexCharts;

const pages = import.meta.glob("./Pages/**/*.vue", { eager: true });

createInertiaApp({
    resolve: (name) => {
        if (name.startsWith("Admin/")) {
            // Remove 'Admin/' prefix and look in Admin folder
            const adminPath = `./Pages/Admin/${name.substring(6)}.vue`;
            if (pages[adminPath]) {
                return pages[adminPath];
            }

            // Alternative: try with different naming conventions
            const altPath = `./Pages/Admin/${name.split("/").pop()}.vue`;
            if (pages[altPath]) {
                return pages[altPath];
            }
        }

        const pagePath = `./Pages/${name}.vue`;
        if (pages[pagePath]) {
            return pages[pagePath];
        }

        // Page not found
        console.error(`Page not found: ${name}`);
    },
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) });
        app.use(plugin).use(ZiggyVue).mount(el);
    },
});

// // run after every Inertia page visit
// router.on("finish", () => {
//     initBootstrap();
// });
