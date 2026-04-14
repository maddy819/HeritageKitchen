<!-- resources/js/Pages/Auth/ResetPassword.vue -->
<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import Button from '@/Components/UI/Button.vue';
import TextInput from '@/Components/UI/TextInput.vue';
import InputLabel from '@/Components/UI/InputLabel.vue';

const validationErrors = ref({});

const props = defineProps({
    email: String,
    token: String,
});

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
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
    
    // Fix: Check if password_confirmation exists
    if (!form.password_confirmation) {
        errors.password_confirmation = 'Please confirm your password';
    } else if (form.password !== form.password_confirmation) {
        errors.password_confirmation = 'Passwords do not match';
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

    form.post(route('password.store'), {
        onSuccess: (response) => {
            console.log('Password reset successful', response);
            // Form will reset automatically after success
        },
        onError: (errors) => {
            console.error('Password reset failed:', errors);
            // Scroll to top to show errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onFinish: () => {
            form.reset('password', 'password_confirmation')
            console.log('Request finished');
        },
    });
};
</script>

<template>
    <AppLayout>
        <section class="my-lg-14 my-8">
            <!-- container -->
            <div class="container">
            <!-- row -->
            <div class="row justify-content-center align-items-center">
                <div class="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                <!-- img -->
                <img src="/assets/images/svg-graphics/fp-g.svg" alt="" class="img-fluid" />
                </div>
                <div class="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1 d-flex align-items-center">
                <div>
                    <div class="mb-lg-9 mb-5">
                    <!-- heading -->
                    <h1 class="mb-2 h2 fw-bold">Reset Your Password</h1>
                    <p>Please enter the email address associated with your account and new password and confirm it below.</p>
                    </div>

                    <!-- Display summary of all errors at the top -->
                    <div v-if="Object.keys(validationErrors).length > 0 || Object.keys(form.errors).length > 0" class="alert alert-danger mb-4">
                        <strong>Please fix the following errors:</strong>
                        <ul class="mb-0 mt-2">
                            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                            <li v-for="error in form.errors" :key="error">{{ error }}</li>
                        </ul>
                    </div>

                    <!-- form -->
                    <form @submit.prevent="submit" class="needs-validation" novalidate>
                        <!-- row -->
                        <div class="row g-3">
                            <!-- col -->
                            <div class="col-12">
                                <!-- input -->
                                <InputLabel for="email" value="Email" class="form-label visually-hidden" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    class="form-control"
                                    v-model="form.email"
                                    required
                                    placeholder="Email"
                                    autofocus
                                    autocomplete="username"
                                />
                                <div v-if="validationErrors.email || form.errors.email" class="invalid-feedback">{{ validationErrors.email || form.errors.email }}</div>
                            </div>

                            <div class="col-12">
                                <!-- input -->
                                <InputLabel for="password" value="Password" class="form-label visually-hidden" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    class="form-control"
                                    v-model="form.password"
                                    placeholder="Password"
                                    required
                                    autocomplete="new-password"
                                />
                                <div v-if="validationErrors.password || form.errors.password" class="invalid-feedback">{{ validationErrors.password || form.errors.password }}</div>
                            </div>

                            <div class="col-12">
                                <!-- input -->
                                <InputLabel for="password_confirmation" class="form-label visually-hidden" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    class="form-control"
                                    v-model="form.password_confirmation"
                                    placeholder="Confirm Password"
                                    required
                                    autocomplete="new-password"
                                />
                                <div v-if="validationErrors.password_confirmation || form.errors.password_confirmation" class="invalid-feedback">{{ validationErrors.password_confirmation || form.errors.password_confirmation }}</div>
                            </div>

                            <!-- btn -->
                            <div class="col-12 d-grid gap-2">
                                <Button type="submit" class="btn btn-primary" :disabled="form.processing">{{ form.processing ? 'Resetting password...' : 'Reset Password' }}</Button>
                            </div>
                        </div>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </section>
    </AppLayout>
</template>