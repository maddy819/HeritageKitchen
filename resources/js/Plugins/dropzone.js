// resources/js/Plugins/dropzone.js

import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

let dropzones = [];
let dropzoneInstance = null;

export function initDropzones(ElementId, url) {
    Dropzone.autoDiscover = false;

    // destroy old instances (important for Inertia)
    dropzones.forEach((dz) => dz.destroy());
    dropzones = [];

    const element = document.querySelector(`#${ElementId}`);

    if (!element) return;

    // prevent duplicate init
    if (element.dropzone) {
        element.dropzone.destroy();
    }

    const dz = new Dropzone(element, {
        url: url, // 🔥 use Laravel route
        method: "post",
        paramName: "file",
        maxFilesize: 5,
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        autoProcessQueue: false,
        parallelUploads: 10,

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

    dropzones.push(dz);
}

export function getDropzoneInstance() {
    return dropzoneInstance;
}

export function destroyDropzones() {
    dropzones.forEach((dz) => dz.destroy());
    dropzones = [];
}

export function getDropzoneFiles() {
    if (!dropzoneInstance) return [];

    return dropzoneInstance.files;
}
