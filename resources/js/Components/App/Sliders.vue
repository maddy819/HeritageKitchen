<script setup>
import asset from '@/helpers/asset';
</script>

<template>
    <section class="mt-8">
    <div class="container">
        <div class="hero-slider">
            <div
                :style="{ backgroundImage: `url(${asset('assets/images/slider/slide-1.jpg')})`, backgroundSize: 'cover', borderRadius: '0.5rem', backgroundPosition: 'center' }">
                <div class="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                    <span class="badge text-bg-warning">Opening Sale Discount 50%</span>

                    <h2 class="text-dark display-5 fw-bold mt-4">SuperMarket For Fresh Grocery</h2>
                    <p class="lead">Introduced a new model for online grocery shopping and convenient home
                        delivery.</p>
                    <a href="#!" class="btn btn-dark mt-3">
                        Shop Now
                        <i class="feather-icon icon-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>
            <div
                    :style="{ backgroundImage: `url(${asset('assets/images/slider/slider-2.jpg')})`, backgroundSize: 'cover', borderRadius: '0.5rem', backgroundPosition: 'center' }">
                <div class="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                    <span class="badge text-bg-warning">Free Shipping - orders over $100</span>
                    <h2 class="text-dark display-5 fw-bold mt-4">
                        Free Shipping on
                        <br />
                        orders over
                        <span class="text-primary">$100</span>
                    </h2>
                    <p class="lead">Free Shipping to First-Time Customers Only, After promotions and discounts
                        are applied.</p>
                    <a href="#!" class="btn btn-dark mt-3">
                        Shop Now
                        <i class="feather-icon icon-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
</template>