<template>
    <button
        :type="type"
        :class="class"
    >
        <slot />
    </button>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'submit'
    },
    class: {
        type: String,
        default: 'btn btn-primary'
    }
});
</script>