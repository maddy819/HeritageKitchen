import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

let instances = [];

export function initDatepickers() {
    // destroy old instances (Inertia navigation fix)
    instances.forEach((fp) => fp.destroy());
    instances = [];

    const elements = document.querySelectorAll(".datepicker");

    if (!elements.length) return;

    elements.forEach((el) => {
        const fp = flatpickr(el, {
            //enableTime: true,
            dateFormat: "Y-m-d",
        });

        instances.push(fp);
    });
}

export function destroyDatepickers() {
    instances.forEach((fp) => fp.destroy());
    instances = [];
}
