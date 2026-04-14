<template>
    <Head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="csrf-token" :content="csrfToken">
        <title>{{ computedTitle }}</title>
        
        <!-- Favicon icon -->
        <link rel="shortcut icon" type="image/x-icon" href="/assets/images/favicon/favicon.ico">
        
        <!-- Additional Styles -->
        <slot name="styles"></slot>
        
        <!-- Additional head content from parent -->
        <slot name="head"></slot>
    </Head>
</template>

<script setup>
import { Head } from '@inertiajs/vue3'
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Home'
    },
    appName: {
        type: String,
        default: 'MyApp'
    }
})

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || ''

const computedTitle = computed(() => {
    return props.title === 'Home' 
        ? props.appName 
        : `${props.title} - ${props.appName}`
})
</script>