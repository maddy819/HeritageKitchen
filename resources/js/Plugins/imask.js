// resources/js/plugins/imask.js

let masks = [];

export function initMasks() {
    // 🔥 destroy old masks
    masks.forEach((m) => m.destroy && m.destroy());
    masks = [];

    // Phone mask
    const phone = document.getElementById("phone-mask");
    if (phone) {
        const mask = IMask(phone, {
            mask: "+{7}(000)000-00-00",
        });

        mask.on("accept", () => {
            if (mask.unmaskedValue.length >= 11) {
                document.getElementById("phone-complete").style.display = "";
                document.getElementById("phone-unmasked").innerHTML =
                    mask.unmaskedValue;
            }
        });

        mask.on("complete", () => {
            document.getElementById("phone-complete").style.display =
                "inline-block";
        });

        masks.push(mask);
    }

    // SSN mask
    const ssn = document.getElementById("ssn-mask");
    if (ssn) {
        const mask = IMask(ssn, {
            mask: "XXX-XX-0000",
            definitions: {
                X: {
                    mask: "0",
                    displayChar: "X",
                    placeholderChar: "#",
                },
            },
            lazy: false,
            overwrite: "shift",
        });

        mask.on("accept", () => {
            if (mask.value.length === 11) {
                document.getElementById("ssn-complete").style.display = "";
                document.getElementById("ssn-value").innerHTML = mask.value;
            }
        });

        mask.on("complete", () => {
            document.getElementById("ssn-complete").style.display =
                "inline-block";
        });

        masks.push(mask);
    }

    // Number mask
    const number = document.getElementById("number-mask");
    if (number) {
        const mask = IMask(number, {
            mask: Number,
            min: -10000,
            max: 10000,
            thousandsSeparator: " ",
        });

        mask.on("accept", () => {
            document.getElementById("number-value").innerHTML =
                mask.masked.number;
        });

        masks.push(mask);
    }

    // Date mask
    const date = document.getElementById("date-mask");
    if (date) {
        const mask = IMask(date, {
            mask: Date,
            min: new Date(1990, 0, 1),
            max: new Date(2020, 0, 1),
            lazy: false,
        });

        mask.on("accept", () => {
            document.getElementById("date-value").innerHTML =
                mask.masked.date || "-";
        });

        masks.push(mask);
    }

    // Card mask
    const card = document.getElementById("card-mask");
    if (card) {
        const mask = IMask(card, {
            mask: "0000-0000-0000-0000",
        });

        masks.push(mask);
    }

    // Digit mask
    const digit = document.getElementById("digit-mask");
    if (digit) {
        const mask = IMask(digit, {
            mask: "000",
        });

        masks.push(mask);
    }
}
