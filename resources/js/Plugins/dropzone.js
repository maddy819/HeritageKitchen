// resources/js/Plugins/dropzone.js

import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

let dropzones = [];
let dropzoneInstance = null;
let onRemoveExistingCallback = null;

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
        url: url,
        method: "post",
        paramName: "file",
        maxFilesize: 5,
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        autoProcessQueue: false,
        parallelUploads: 10,
        dictRemoveFile: "Remove",
        headers: {
            "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content"),
        },
    });

    // store instance
    dropzoneInstance = dz;

    // Override the removeFile method completely
    const originalRemoveFile = dz.removeFile.bind(dz);
    dz.removeFile = function (file) {
        // Check if it's an existing file from database
        if (file.existing === true) {
            // Show confirmation dialog
            const userConfirmed = confirm(
                "Are you sure you want to delete this image? This action cannot be undone.",
            );

            if (userConfirmed) {
                // Call the callback if set
                if (onRemoveExistingCallback && file.imageId) {
                    onRemoveExistingCallback(file.imageId, file);
                }
                // Call original remove method
                originalRemoveFile(file);
            }
            // If cancelled, do nothing - file remains
        } else {
            // For new files, remove immediately without confirmation
            originalRemoveFile(file);
        }
    };

    // Also handle the remove button click to use our overridden method
    dz.on("addedfile", (file) => {
        if (file.existing && file.previewElement) {
            // Find and replace the remove button to prevent default behavior
            const removeButton =
                file.previewElement.querySelector(".dz-remove");
            if (removeButton) {
                // Remove all existing event listeners by cloning and replacing
                const newRemoveButton = removeButton.cloneNode(true);
                removeButton.parentNode.replaceChild(
                    newRemoveButton,
                    removeButton,
                );

                // Add our custom click handler
                newRemoveButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // This will call our overridden removeFile method
                    dz.removeFile(file);
                    return false;
                });
            }
        }

        // Apply styling for existing files
        if (file.existing && file.url) {
            setTimeout(() => {
                const imgElement = file.previewElement?.querySelector("img");
                if (imgElement) {
                    imgElement.style.objectFit = "contain";
                    imgElement.style.width = "100%";
                    imgElement.style.height = "100%";
                }
            }, 100);
        }
    });

    dz.on("removedfile", (file) => {
        console.log(
            "File removed:",
            file.name,
            file.existing ? "(existing)" : "(new)",
        );
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

export function setOnRemoveExistingCallback(callback) {
    onRemoveExistingCallback = callback;
}

export const setDropzoneFiles = (files, existingFiles = []) => {
    if (!dropzoneInstance) {
        console.error("Dropzone not initialized");
        return;
    }

    // Clear existing files
    dropzoneInstance.removeAllFiles(true);

    // Add existing files first
    if (existingFiles && existingFiles.length > 0) {
        existingFiles.forEach((file) => {
            // Create a mock file object for existing images
            const mockFile = {
                id: file.id,
                imageId: file.id,
                name: file.image || file.filename || file.name,
                size: file.imagesize || file.size || 12345,
                type: `image/${file.imagetype || "jpeg"}`,
                status: Dropzone.ADDED,
                accepted: true,
                url: file.imageurl || file.url || file.path,
                existing: true,
                upload: {
                    uuid: file.id || Math.random().toString(36).substring(7),
                },
            };

            // Add the mock file to dropzone
            dropzoneInstance.emit("addedfile", mockFile);

            // Add thumbnail if URL is provided
            if (mockFile.url) {
                dropzoneInstance.emit("thumbnail", mockFile, mockFile.url);
            }

            // Mark as complete
            dropzoneInstance.emit("complete", mockFile);

            // Push to dropzone files array
            dropzoneInstance.files.push(mockFile);
        });
    }

    // Add new files (File objects from input)
    if (files && files.length > 0) {
        files.forEach((file) => {
            if (file instanceof File) {
                dropzoneInstance.addFile(file);
            } else if (typeof file === "string") {
                fetch(file)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const fileName = file.split("/").pop();
                        const fileObj = new File([blob], fileName, {
                            type: blob.type,
                        });
                        dropzoneInstance.addFile(fileObj);
                    })
                    .catch((error) =>
                        console.error("Error fetching file:", error),
                    );
            }
        });
    }
};

export function getNewFilesForSubmission() {
    if (!dropzoneInstance) return [];
    return dropzoneInstance.files.filter(
        (file) => !file.existing && file instanceof File,
    );
}
