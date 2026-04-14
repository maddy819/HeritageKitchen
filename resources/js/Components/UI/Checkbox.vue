<!-- resources/js/Components/Checkbox.vue -->
<template>
    <input
        type="checkbox"
        :checked="checked"
        @change="$emit('update:checked', $event.target.checked)"
        :class="classes"
        :value="value"
    />
</template>

<script setup>
defineProps({
    checked: {
        type: Boolean,
        default: false
    },
    classes: {
        type: String,
        default: ''

    },
    value: {
        type: [String, Number],
        default: ''
    }

});

defineEmits(['update:checked']);
</script>