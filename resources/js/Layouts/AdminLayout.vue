<template>
    
    <!-- head -->
    <HeadPartial :title="title" :appName="appName">
        <template #styles>
            <!-- Additional styles can be added here if needed -->
        </template>
        <template #head>
            <!-- Additional head content from parent -->
            <slot name="head" />
        </template>
    </HeadPartial>

    <!-- Top Navigation -->
    <TopNav />
    <!-- content -->
     <div class="main-wrapper">
        <!-- Side Navigation -->
        <Navigation />

        <main class="main-content-wrapper">
            <slot />
        </main>
     </div>    
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { computed, nextTick } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { router } from "@inertiajs/vue3";

import HeadPartial from '@/Components/Admin/Head.vue'
import TopNav from '@/Components/Admin/TopNav.vue';
import Navigation from '@/Components/Admin/Navigation.vue';
import { initCharts } from '@/Plugins/charts.js';
import { destroyCharts } from "@/Plugins/charts.js";
import { destroyEditor } from '@/Plugins/Editor';
import { destroyDatepickers } from '@/Plugins/flatpickr';
import { initValidation } from '@/Plugins/validation';

const props = defineProps({
    title: {
        type: String,
        default: 'Home'
    }
})

const page = usePage()
const appName = import.meta.env.VITE_APP_NAME || 'Heritage Kitchen'
const auth = computed(() => page.props.auth || { user: null })


onMounted(async () => {
    initCharts();
    initValidation();
    
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((el) => {
        new bootstrap.Dropdown(el);
    });
});

// run after every Inertia page visit
router.on("finish", async () => {
    await nextTick();

    destroyCharts();
    initValidation();
    destroyEditor();
    destroyDatepickers();
});
</script>