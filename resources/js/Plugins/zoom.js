// resources/js/plugins/zoom.js

export function initZoom() {
    const elements = document.querySelectorAll(".zoom");

    elements.forEach((el) => {
        // prevent duplicate binding
        if (el._zoomAttached) return;

        const handler = (e) => {
            const target = e.currentTarget;

            let offsetX, offsetY;

            if (e.touches) {
                offsetX = e.touches[0].pageX - target.offsetLeft;
                offsetY = e.touches[0].pageY - target.offsetTop;
            } else {
                offsetX = e.offsetX;
                offsetY = e.offsetY;
            }

            const x = (offsetX / target.offsetWidth) * 100;
            const y = (offsetY / target.offsetHeight) * 100;

            target.style.backgroundPosition = `${x}% ${y}%`;
        };

        // mouse + touch support
        el.addEventListener("mousemove", handler);
        el.addEventListener("touchmove", handler);

        el._zoomAttached = true;
    });
}
