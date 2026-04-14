// resources/js/plugins/password-toggler.js

class PasswordToggler {
    constructor(passwordClass, togglerClass) {
        this.passwordElements = document.getElementsByClassName(passwordClass);
        this.togglerElements = document.getElementsByClassName(togglerClass);
        this.attachEventListeners();
    }

    attachEventListeners() {
        for (let i = 0; i < this.togglerElements.length; i++) {
            const toggler = this.togglerElements[i];

            // prevent duplicate listeners
            if (toggler._togglerAttached) continue;

            toggler.addEventListener("click", () => {
                this.showHidePassword(i);
            });

            toggler._togglerAttached = true;
        }
    }

    showHidePassword(index) {
        const input = this.passwordElements[index];
        const toggler = this.togglerElements[index];

        if (!input || !toggler) return;

        if (input.type === "password") {
            input.setAttribute("type", "text");
            toggler.classList.add("bi-eye");
            toggler.classList.remove("bi-eye-slash");
        } else {
            input.setAttribute("type", "password");
            toggler.classList.remove("bi-eye");
            toggler.classList.add("bi-eye-slash");
        }
    }
}

// ✅ export init function
export function initPasswordToggler() {
    new PasswordToggler("fakePassword", "passwordToggler");
}
