<script setup>
import { onMounted, nextTick, onBeforeUnmount } from "vue"
import { getDropzoneInstance, initDropzones } from "@/Plugins/dropzone"

const props = defineProps({
    id: {
        type: String,
        default: 'my-dropzone'
    },
    url: {
        type: String,
        default: '/upload-image'
    },
});

onMounted(async () => {
    await nextTick()
    
    initDropzones(props.id, props.url)
})

onBeforeUnmount(() => {
    const dz = getDropzoneInstance();
    if (dz) {
        dz.destroy();
    }
});
</script>

<template>
    <div :id="id" class="dropzone mt-4 border-dashed rounded-2 min-h-0"></div>
</template>