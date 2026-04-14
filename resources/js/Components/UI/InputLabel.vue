<!-- resources/js/Components/InputLabel.vue -->
<template>
    <label :for="for" :class="class">
        <slot />
    </label>
</template>

<script setup>
defineProps({
    class: {
        type: String,
        default: ''
    },
    for: {
        type: String,
        default: null
    }
});
</script>