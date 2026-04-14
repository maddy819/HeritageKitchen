<script setup>
import { onMounted, nextTick } from "vue";
import { initEditor } from "@/Plugins/Editor";

const props = defineProps({
    id: {
        type: String,
        default: null
    }
});

onMounted(async () => {
    await nextTick();
    initEditor();
});
</script>

<template>
    <div>
        <div :id="id" ref="editorRef" style="height: 200px;" readonly ></div>
    </div>
</template>