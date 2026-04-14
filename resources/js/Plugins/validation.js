// resources/js/plugins/validation.js

export function initValidation() {
    const forms = document.querySelectorAll(".needs-validation");

    forms.forEach((form) => {
        // ❗ prevent duplicate listeners
        if (form._validationAttached) return;

        const handler = (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        };

        form.addEventListener("submit", handler, false);

        // mark as initialized
        form._validationAttached = true;
    });
}
