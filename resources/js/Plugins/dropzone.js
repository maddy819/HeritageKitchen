import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

let dropzones = [];
let dropzoneInstance = null;

export function initDropzones() {
    Dropzone.autoDiscover = false;

    // destroy old instances (important for Inertia)
    dropzones.forEach((dz) => dz.destroy());
    dropzones = [];

    const element = document.querySelector("#my-dropzone");

    if (!element) return;

    // prevent duplicate init
    if (element.dropzone) {
        element.dropzone.destroy();
    }

    const dz = new Dropzone(element, {
        url: "/upload", // 🔥 use Laravel route
        method: "post",
        paramName: "file",
        maxFilesize: 5,
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        autoProcessQueue: true,

        headers: {
            "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content"),
        },
    });

    // store instance
    dropzoneInstance = dz;

    dz.on("addedfile", (file) => {
        console.log("File added:", file.name);
    });

    dz.on("removedfile", (file) => {
        console.log("File removed:", file.name);
    });

    dz.on("success", (file, response) => {
        console.log("Uploaded:", response);
    });

    dropzones.push(dz);
}

export function destroyDropzones() {
    dropzones.forEach((dz) => dz.destroy());
    dropzones = [];
}

export function getDropzoneFiles() {
    if (!dropzoneInstance) return [];

    return dropzoneInstance.files;
}
