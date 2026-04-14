<template>
    <div class="min-h-screen flex flex-col">
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

        <!-- navbar -->
        <Navigation />

        <!-- content -->
        <main class="flex-grow">
            <slot />
        </main>

        <!-- footer -->
        <Footer />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { router } from "@inertiajs/vue3";

// Import Slick Carousel from npm
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import HeadPartial from '@/Components/App/Head.vue'
import Navigation from '@/Components/App/Navigation.vue'
import Footer from '@/Components/App/Footer.vue'

import { initSliders } from "../Plugins/sliders";
import { initValidation } from '../Plugins/validation';
import { initCountdown } from '../Plugins/countdown';
import { initZoom } from '../Plugins/zoom';

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
    initSliders();
    initValidation();
    initCountdown();
    initZoom();
});

// run after every Inertia page visit
router.on("finish", () => {
    initSliders();
    initValidation();
    initCountdown();
    initZoom();
});
</script>