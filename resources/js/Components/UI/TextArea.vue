<!-- resources/js/Components/TextArea.vue -->
<template>
    <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        ref="textarea"
        :class="classes"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :readonly="readonly"
        :id="id"
        :rows="rows"
        :cols="cols"
        :maxlength="maxlength"
        :wrap="wrap"
    />
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    name: {
        type: String,
        required: true,
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
    },
    rows: {
        type: String,
        default: 3
    },
    cols: {
        type: Number,
        default: null
    },
    maxlength: {
        type: Number,
        default: null
    },
    wrap: {
        type: String,
        default: 'soft', // Options: 'soft', 'hard', 'off'
        validator: (value) => ['soft', 'hard', 'off'].includes(value)
    }
});

const emit = defineEmits(['update:modelValue']);

const textarea = ref(null);

onMounted(() => {
    if (props.autofocus) {
        textarea.value.focus();
    }
});

defineExpose({
    focus: () => textarea.value.focus(),
    select: () => textarea.value.select(),
    setSelectionRange: (start, end) => textarea.value.setSelectionRange(start, end)
});
</script>