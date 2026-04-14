// resources/js/plugins/sidebar.js

export function initSidebarActive() {
    const fullUrl = window.location.href;

    const pathUrl = fullUrl.replace(
        window.location.protocol + "//" + window.location.host + "/",
        "",
    );

    document.querySelectorAll("ul#sidebarnav a").forEach((link) => {
        if (link.href === fullUrl || link.getAttribute("href") === pathUrl) {
            let el = link;

            while (
                el.parentElement &&
                !el.parentElement.classList.contains("sidebar-nav")
            ) {
                const parent = el.parentElement;

                if (parent.tagName === "LI") {
                    const anchor = parent.querySelector("a");

                    if (anchor) {
                        anchor.classList.add("active");

                        if (
                            !parent.parentElement.classList.contains(
                                "sidebarnav",
                            )
                        ) {
                            parent.classList.add("active");
                        }
                    }
                } else if (parent.tagName === "UL") {
                    parent.classList.add("in");
                } else {
                    parent.classList.add("active");
                }

                el = parent;
            }
        }
    });
}
