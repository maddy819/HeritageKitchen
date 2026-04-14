<script setup>
import { ref } from "vue";
import { Link } from "@inertiajs/vue3";
import simplebar from "simplebar-vue";
import { route } from "ziggy-js";
import "simplebar-vue/dist/simplebar.min.css";
import { useDropdown } from '@/composables/useDropdown';

const { isOpen, toggle } = useDropdown();
const open = ref({});

// toggle function
const toggleMenu = (key) => {
    open.value[key] = !open.value[key];
};
</script>

<template>
    <nav class="navbar-vertical-nav d-none d-xl-block">
        <div class="navbar-vertical">

            <!-- Logo -->
            <div class="px-4 py-5">
                <Link :href="route('home')" class="navbar-brand">
                    <img src="/assets/images/logo/freshcart-logo.svg" />
                </Link>
            </div>

            <simplebar class="navbar-vertical-content flex-grow-1">
                <ul class="navbar-nav flex-column">

                    <!-- Dashboard -->
                    <li class="nav-item">
                        <Link :href="route('admin.dashboard')" class="nav-link active">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-house"></i></span>
                                <span class="nav-link-text">Dashboard</span>
                            </div>
                        </Link>
                    </li>

                    <!-- Section -->
                    <li class="nav-item mt-6 mb-3">
                        <span class="nav-label">Store Managements</span>
                    </li>

                    <!-- Products -->
                    <li class="nav-item">
                        <Link :href="route('admin.products')" class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-cart"></i></span>
                                <span class="nav-link-text">Products</span>
                            </div>
                        </Link>
                    </li>

                    <!-- Categories -->
                    <li class="nav-item">
                        <Link :href="route('admin.categories')" class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-list-task"></i></span>
                                <span class="nav-link-text">Categories</span>
                            </div>
                        </Link>
                    </li>

                    <!-- Orders -->
                    <li class="nav-item">
                        <a class="nav-link"
                        href="#"
                        @click.prevent="toggleMenu('orders')"
                        :class="{ collapsed: !open.orders }">
                            <div class="d-flex align-items-center w-100">
                                <span class="nav-link-icon"><i class="bi bi-bag"></i></span>
                                <span class="nav-link-text">Orders</span>

                                <!-- Arrow -->
                                <i class="bi bi-chevron-down ms-auto transition"
                                :class="{ rotate: open.orders }"></i>
                            </div>
                        </a>

                        <div v-show="open.orders" class="collapse show">
                            <ul class="nav flex-column">
                                <li class="nav-item"><a class="nav-link">List</a></li>
                                <li class="nav-item"><a class="nav-link">Single</a></li>
                            </ul>
                        </div>
                    </li>

                    <!-- Vendors -->
                    <li class="nav-item">
                        <a class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-shop"></i></span>
                                <span class="nav-link-text">Sellers / Vendors</span>
                            </div>
                        </a>
                    </li>

                    <!-- Customers -->
                    <li class="nav-item">
                        <a class="nav-link"
                        href="#"
                        @click.prevent="toggleMenu('customers')"
                        :class="{ collapsed: !open.customers }">
                            <div class="d-flex align-items-center w-100">
                                <span class="nav-link-icon"><i class="bi bi-people"></i></span>
                                <span class="nav-link-text">Customers</span>
                                <span class="badge bg-light-success text-dark-success ms-2">New</span>

                                <i class="bi bi-chevron-down ms-auto transition"
                                :class="{ rotate: open.customers }"></i>
                            </div>
                        </a>

                        <div v-show="open.customers" class="collapse show">
                            <ul class="nav flex-column">
                                <li class="nav-item"><a class="nav-link">Customers</a></li>
                                <li class="nav-item"><a class="nav-link">Create Customers</a></li>
                                <li class="nav-item"><a class="nav-link">Edit Customers</a></li>
                            </ul>
                        </div>
                    </li>

                    <!-- Reviews -->
                    <li class="nav-item">
                        <a class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-star"></i></span>
                                <span class="nav-link-text">Reviews</span>
                            </div>
                        </a>
                    </li>

                    <!-- Multi Menu -->
                    <li class="nav-item">
                        <a class="nav-link"
                        href="#"
                        @click.prevent="toggleMenu('menu1')"
                        :class="{ collapsed: !open.menu1 }">

                            <span class="nav-link-icon">
                                <i class="bi bi-arrow-90deg-down"></i>
                            </span>
                            <span class="nav-link-text">Menu Level</span>

                            <i class="bi bi-chevron-down ms-auto transition"
                            :class="{ rotate: open.menu1 }"></i>
                        </a>

                        <div v-show="open.menu1" class="collapse show">
                            <ul class="nav flex-column">

                                <li class="nav-item">
                                    <a class="nav-link"
                                    @click.prevent="toggleMenu('menu2')">
                                        Two Level

                                        <i class="bi bi-chevron-down ms-auto transition"
                                        :class="{ rotate: open.menu2 }"></i>
                                    </a>

                                    <div v-show="open.menu2" class="collapse show">
                                        <ul class="nav flex-column">
                                            <li class="nav-item"><a class="nav-link">NavItem 1</a></li>
                                            <li class="nav-item"><a class="nav-link">NavItem 2</a></li>
                                        </ul>
                                    </div>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link"
                                    @click.prevent="toggleMenu('menu3')">
                                        Three Level

                                        <i class="bi bi-chevron-down ms-auto transition"
                                        :class="{ rotate: open.menu3 }"></i>
                                    </a>

                                    <div v-show="open.menu3" class="collapse show">
                                        <ul class="nav flex-column">
                                            <li class="nav-item">
                                                <a class="nav-link">NavItem 1</a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </li>

                    <!-- Footer Section -->
                    <li class="nav-item mt-6 mb-3">
                        <span class="nav-label">Site Settings</span>
                        <span class="badge bg-light-info text-dark-info">Coming Soon</span>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-newspaper"></i></span>
                                <span class="nav-link-text">Blog</span>
                            </div>
                        </a>
                    </li>

                </ul>
            </simplebar>
        </div>
    </nav>

    <nav :class="{ show: isOpen }" class="navbar-vertical-nav offcanvas offcanvas-start navbar-offcanvac" tabindex="-1">
        <div class="navbar-vertical">

            <!-- Header -->
            <div class="px-4 py-5 d-flex justify-content-between align-items-center">
                <Link href="/" class="navbar-brand">
                    <img src="/assets/images/logo/freshcart-logo.svg" alt="" />
                </Link>
                <button type="button" @click="toggle" class="btn-close" aria-label="Close"></button>
            </div>

            <!-- Content -->
            <simplebar class="navbar-vertical-content flex-grow-1">
                <ul class="navbar-nav flex-column">

                    <!-- Dashboard -->
                    <li class="nav-item">
                        <Link :href="route('admin.dashboard')" class="nav-link active">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-house"></i></span>
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>

                    <li class="nav-item mt-6 mb-3">
                        <span class="nav-label">Store Managements</span>
                    </li>

                    <!-- Products -->
                    <li class="nav-item">
                        <Link :href="route('admin.products')" class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-cart"></i></span>
                                <span class="nav-link-text">Products</span>
                            </div>
                        </Link>
                    </li>

                    <!-- Categories -->
                    <li class="nav-item">
                        <Link :href="route('admin.categories')" class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-list-task"></i></span>
                                <span class="nav-link-text">Categories</span>
                            </div>
                        </Link>
                    </li>

                    <!-- Orders -->
                    <li class="nav-item">
                        <a class="nav-link"
                        href="#"
                        @click.prevent="toggleMenu('orders')"
                        :class="{ collapsed: !open.orders }">

                            <div class="d-flex align-items-center w-100">
                                <span class="nav-link-icon"><i class="bi bi-bag"></i></span>
                                <span class="nav-link-text">Orders</span>

                                <i class="bi bi-chevron-down ms-auto transition"
                                :class="{ rotate: open.orders }"></i>
                            </div>
                        </a>

                        <div v-show="open.orders" class="collapse show">
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <a class="nav-link">List</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link">Single</a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <!-- Vendors -->
                    <li class="nav-item">
                        <a class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-shop"></i></span>
                                <span class="nav-link-text">Sellers / Vendors</span>
                            </div>
                        </a>
                    </li>

                    <!-- Customers -->
                    <li class="nav-item">
                        <a class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-people"></i></span>
                                <span class="nav-link-text">Customers</span>
                            </div>
                        </a>
                    </li>

                    <!-- Reviews -->
                    <li class="nav-item">
                        <a class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-star"></i></span>
                                <span class="nav-link-text">Reviews</span>
                            </div>
                        </a>
                    </li>

                    <!-- Footer Section -->
                    <li class="nav-item mt-6 mb-3">
                        <span class="nav-label">Site Settings</span>
                        <span class="badge bg-light-info text-dark-info">Coming Soon</span>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-newspaper"></i></span>
                                <span class="nav-link-text">Blog</span>
                            </div>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link disabled">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-images"></i></span>
                                <span class="nav-link-text">Media</span>
                            </div>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link disabled">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon"><i class="bi bi-gear"></i></span>
                                <span class="nav-link-text">Store Settings</span>
                            </div>
                        </a>
                    </li>

                </ul>
            </simplebar>
        </div>
    </nav>

</template>

<style>
.transition {
    transition: transform 0.3s ease;
}
.rotate {
    transform: rotate(180deg);
}
</style>