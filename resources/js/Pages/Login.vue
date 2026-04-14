<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import { ref } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import InputLabel from '@/Components/UI/InputLabel.vue';
import Button from '@/Components/UI/Button.vue';
import TextInput from '@/Components/UI/TextInput.vue';
import Checkbox from '@/Components/UI/Checkbox.vue';

const validationErrors = ref({});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

// Frontend validation function
const validateForm = () => {
    const errors = {};
    
    if (!form.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!form.password) {
        errors.password = 'Password is required';
    } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }
    
    validationErrors.value = errors;
    return Object.keys(errors).length === 0;
};

const submit = () => {
    // Clear previous errors
    validationErrors.value = {};
    form.clearErrors(); // Clear Inertia form errors
    
    // Frontend validation
    if (!validateForm()) {
        return;
    }

    form.post(route('login'), {
        onSuccess: (response) => {
            console.log('Login successful', response);
        },
        onError: (errors) => {
            console.error('Login failed:', errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onFinish: () => {
            console.log('Request finished');
        },
    });
};
</script>

<template>
    <AppLayout title="Home">
        <template #head>
            <p class="text-center text-gray-500">Welcome to Heritage Kitchen! Explore our delicious recipes and culinary tips.</p>
        </template>
        
        <!-- Your page content here -->
        <main>
            <!-- section -->
            <section class="my-lg-14 my-8">
                <div class="container">
                    <!-- row -->
                    <div class="row justify-content-center align-items-center">
                        <div class="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                            <!-- img -->
                            <img src="/assets/images/svg-graphics/signin-g.svg" alt="" class="img-fluid" />
                        </div>
                        <!-- col -->
                        <div class="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
                            <div class="mb-lg-9 mb-5">
                                <h1 class="mb-1 h2 fw-bold">Sign in to FreshCart</h1>
                                <p>Welcome back to FreshCart! Enter your email to get started.</p>
                            </div>

                            <!-- Display summary of all errors at the top -->
                            <div v-if="Object.keys(validationErrors).length > 0 || Object.keys(form.errors).length > 0" class="alert alert-danger mb-4">
                                <strong>Please fix the following errors:</strong>
                                <ul class="mb-0 mt-2">
                                    <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                                    <li v-for="error in form.errors" :key="error">{{ error }}</li>
                                </ul>
                            </div>

                            <!-- Show verification message if user logged in but not verified -->
                            <div v-if="$page.props.flash?.status === 'verification-link-sent'" class="mb-4 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>

                            <form @submit.prevent="submit" class="needs-validation" novalidate>
                                <div class="row g-3">
                                <!-- row -->

                                <div class="col-12">
                                    <!-- input -->
                                    <InputLabel for="formSigninEmail" class="form-label" >Email address</InputLabel>
                                    <TextInput v-model="form.email" type="email" name="email" class="form-control" id="formSigninEmail" placeholder="Email" required="required" />
                                    <div v-if="validationErrors.email || form.errors.email" class="invalid-feedback">{{ validationErrors.email || form.errors.email }}</div>
                                </div>
                                <div class="col-12">
                                    <!-- input -->
                                    <div class="password-field position-relative">
                                        <InputLabel for="formSigninPassword" class="form-label" >Password</InputLabel>
                                        <div class="password-field position-relative">
                                            <TextInput v-model="form.password" type="password" name="password" class="form-control fakePassword" id="formSigninPassword" placeholder="*****" required="required" />
                                            <span><i class="bi bi-eye-slash passwordToggler"></i></span>
                                            <div v-if="validationErrors.password || form.errors.password" class="invalid-feedback">{{ validationErrors.password || form.errors.password }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <!-- form check -->
                                    <div class="form-check">
                                    <Checkbox class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model:checked="form.remember" />
                                    <!-- label -->
                                    <InputLabel class="form-check-label" for="flexCheckDefault">Remember me</InputLabel>
                                    </div>
                                    <div>
                                    Forgot password?
                                    <Link :href="route('password.request')">Reset It</Link>
                                    </div>
                                </div>
                                <!-- btn -->
                                <div class="col-12 d-grid">
                                    <Button type="submit" class="btn btn-primary" :disabled="form.processing">{{ form.processing ? 'Signing in...' : 'Sign In' }}</Button>
                                </div>
                                <!-- link -->
                                <div>
                                    Don’t have an account?
                                    <Link :href="route('signup')">Sign Up</Link>
                                </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </AppLayout>
</template>