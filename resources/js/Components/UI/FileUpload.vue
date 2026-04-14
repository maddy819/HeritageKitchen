<script setup>
import { onMounted, nextTick } from "vue"
import { initDropzones } from "@/Plugins/dropzone"

onMounted(async () => {
    await nextTick()
    
    initDropzones()
})
</script>

<template>
    <div id="my-dropzone" class="dropzone mt-4 border-dashed rounded-2 min-h-0"></div>
</template>