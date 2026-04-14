import Quill from "quill";
import "quill/dist/quill.snow.css";

let quillInstance = null;

export function initEditor() {
    var quill,
        editorElement = document.querySelector("#editor");

    // destroy existing before re-init (important for Inertia)
    if (editorElement && editorElement.__quill) {
        editorElement.__quill = null;
    }

    editorElement &&
        (quill = new Quill(editorElement, {
            modules: {
                toolbar: [
                    [
                        {
                            header: [1, 2, !1],
                        },
                    ],
                    [
                        {
                            font: [],
                        },
                    ],
                    ["bold", "italic", "underline", "strike"],
                    [
                        {
                            size: ["small", !1, "large", "huge"],
                        },
                    ],
                    [
                        {
                            list: "ordered",
                        },
                        {
                            list: "bullet",
                        },
                    ],
                    [
                        {
                            color: [],
                        },
                        {
                            background: [],
                        },
                        {
                            align: [],
                        },
                    ],
                    ["link", "image", "code-block", "video"],
                ],
            },
            theme: "snow",
            placeholder: "Write something amazing...",
        }));

    // store instance
    if (editorElement && quill) {
        editorElement.__quill = quill;
        quillInstance = quill;
    }
}

export function destroyEditor() {
    const editorElement = document.querySelector("#editor");

    if (editorElement && editorElement.__quill) {
        // remove reference (Quill has no proper destroy API)
        editorElement.__quill = null;
    }

    quillInstance = null;
}

export function getEditorContent() {
    return quillInstance ? quillInstance.root.innerHTML : "";
}
