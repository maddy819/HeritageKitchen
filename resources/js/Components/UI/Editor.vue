<script setup>
import { onMounted, nextTick } from "vue";
import { initEditor } from "@/Plugins/Editor";

onMounted(async () => {
    await nextTick();
    initEditor();
});
</script>

<template>
    <div>
        <div id="editor" ref="editorRef" style="height: 200px;" ></div>
    </div>
</template>