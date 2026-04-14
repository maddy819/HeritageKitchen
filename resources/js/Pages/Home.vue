<!-- resources/js/Pages/Home.vue -->
<template>
    <AppLayout title="Home">
        <template #head>
            <p class="text-center text-gray-500">Welcome to Heritage Kitchen! Explore our delicious recipes and culinary tips.</p>
        </template>
        
        <!-- Your page content here -->
        <main>
            <Sliders />
            <FeaturedCategories />
            <Banners />
            <PopularProducts />
            <BestSellers />
            <Features />
        </main>
    </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import Sliders from '../Components/App/Sliders.vue';
import FeaturedCategories from '../Components/App/FeaturedCategories.vue';
import Banners from '../Components/App/Banners.vue';
import PopularProducts from '../Components/App/PopularProducts.vue';
import BestSellers from '../Components/App/BestSellers.vue';
import Features from '../Components/App/Features.vue';
</script>