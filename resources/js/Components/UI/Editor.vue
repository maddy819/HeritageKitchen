<!-- resources/js/Components/UI/Editor.vue -->
 <script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps({
    id: {
        type: String,
        default: null
    },
    content: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Write something amazing...'
    },
    height: {
        type: String,
        default: '300px'
    }
});

const emit = defineEmits(['update:content', 'ready']);

const editorId = props.id;
const editorElement = ref(null);
const editorContainer = ref(null);
let quillInstance = null;
let isInitialized = false;

// Initialize editor
const initEditor = () => {
    if (!editorElement.value) {
        console.warn('Editor element not found');
        return;
    }

    // Check if already initialized on this element
    if (editorElement.value.__quill) {
        quillInstance = editorElement.value.__quill;
        isInitialized = true;
        emit('ready', quillInstance);
        return;
    }

    // Clear any existing content
    editorElement.value.innerHTML = '';

    // Create new Quill instance
    const quill = new Quill(editorElement.value, {
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                [{ font: [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ size: ['small', false, 'large', 'huge'] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: [] }, { background: [] }, { align: [] }],
                ['link', 'image', 'code-block', 'video'],
                ['clean']
            ],
        },
        theme: 'snow',
        placeholder: props.placeholder,
    });

    // Store instance on DOM element
    editorElement.value.__quill = quill;
    quillInstance = quill;
    isInitialized = true;

    // Set initial content if provided
    if (props.content) {
        quill.root.innerHTML = props.content;
    }

    // Listen to content changes
    quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        emit('update:content', html);
    });

    // Emit ready event
    emit('ready', quillInstance);
};

// Set editor content
const setContent = (content) => {
    if (quillInstance && content !== undefined && content !== null) {
        if (quillInstance.root.innerHTML !== content) {
            quillInstance.root.innerHTML = content;
        }
    }
};

// Get editor content
const getContent = () => {
    return quillInstance ? quillInstance.root.innerHTML : '';
};

// Destroy editor
const destroyEditor = () => {
    if (quillInstance) {
        // Remove event listeners
        quillInstance.off('text-change');
        
        // Clear references
        if (editorElement.value) {
            editorElement.value.__quill = null;
            editorElement.value.innerHTML = '';
        }
        quillInstance = null;
        isInitialized = false;
    }
};

// Watch for content prop changes from parent
watch(() => props.content, (newContent) => {
    if (newContent !== undefined && newContent !== null && quillInstance) {
        if (quillInstance.root.innerHTML !== newContent) {
            quillInstance.root.innerHTML = newContent;
        }
    }
});

// Watch for height changes
watch(() => props.height, (newHeight) => {
    if (editorElement.value) {
        editorElement.value.style.height = newHeight;
        if (quillInstance) {
            // Refresh Quill editor
            quillInstance.root.style.height = newHeight;
        }
    }
});

// Lifecycle hooks
onMounted(() => {
    initEditor();
});

onBeforeUnmount(() => {
    destroyEditor();
});

// Expose methods for parent components
defineExpose({
    getContent,
    setContent,
    getEditorInstance: () => quillInstance
});
</script>

<template>
    <div ref="editorContainer" class="quill-editor-wrapper">
        <div :id="editorId" ref="editorElement" style="height: 300px;"></div>
    </div>
</template>