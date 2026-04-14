<!-- resources/js/Components/TextInput.vue -->
<template>
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        ref="input"
        :class="classes"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :readonly="readonly"
        :id="id"
    />
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    name: {
        type: String,
        required: true, // Make name required for proper form submission
        default: null
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    autocomplete: {
        type: String,
        default: 'off'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    classes: {
        type: [String, Array, Object],
        default: ''
    },    
    id: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const input = ref(null);

onMounted(() => {
    if (props.autofocus) {
        input.value.focus();
    }
});

defineExpose({
    focus: () => input.value.focus()
});
</script>