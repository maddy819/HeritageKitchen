<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import Button from '@/Components/UI/Button.vue';
import InputLabel from '@/Components/UI/InputLabel.vue';
import TextInput from '@/Components/UI/TextInput.vue';
import AppLayout from '@/Layouts/AppLayout.vue';

const validationErrors = ref({});

const form = useForm({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '', // This was missing
    remember: false,
});

// Frontend validation function
const validateForm = () => {
    const errors = {};
    
    if (!form.firstname.trim()) {
        errors.firstname = 'First name is required';
    }
    
    if (!form.lastname.trim()) {
        errors.lastname = 'Last name is required';
    }
    
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

    console.log('Submitting form data:', form.data()); // Debug log
    
    form.post(route('signup.store'), {
        onSuccess: (response) => {
            console.log('Registration successful', response);
            // Form will reset automatically after success
        },
        onError: (errors) => {
            console.error('Registration failed:', errors);
            // Scroll to top to show errors
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
                <!-- container -->
                <div class="container">
                <!-- row -->
                <div class="row justify-content-center align-items-center">
                    <div class="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                    <!-- img -->
                    <img src="/assets/images/svg-graphics/signup-g.svg" alt="" class="img-fluid" />
                    </div>
                    <!-- col -->
                    <div class="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
                    <div class="mb-lg-9 mb-5">
                        <h1 class="mb-1 h2 fw-bold">Get Start Shopping</h1>
                        <p>Welcome to FreshCart! Enter your email to get started.</p>
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
                        <div class="row g-3">
                        <!-- col -->
                        <div class="col">
                            <!-- input -->
                            <InputLabel for="formSignupfname" class="form-label visually-hidden">First Name</InputLabel>
                            <TextInput v-model="form.firstname" type="text" name="firstname" class="form-control" id="formSignupfname" placeholder="First Name" required="required" />
                            <div v-if="validationErrors.firstname || form.errors.firstname" class="invalid-feedback">{{ validationErrors.firstname || form.errors.firstname }}</div>
                        </div>
                        <div class="col">
                            <!-- input -->
                            <InputLabel for="formSignuplname" class="form-label visually-hidden">Last Name</InputLabel>
                            <TextInput v-model="form.lastname" type="text" name="lastname" class="form-control" id="formSignuplname" placeholder="Last Name" required="required" />
                            <div v-if="validationErrors.lastname || form.errors.lastname" class="invalid-feedback">{{ validationErrors.lastname || form.errors.lastname }}</div>
                        </div>
                        <div class="col-12">
                            <!-- input -->
                            <InputLabel for="formSignupEmail" class="form-label visually-hidden">Email address</InputLabel>
                            <TextInput v-model="form.email" type="email" name="email" class="form-control" id="formSignupEmail" placeholder="Email" required="required" />
                            <div v-if="validationErrors.email || form.errors.email" class="invalid-feedback">{{ validationErrors.email || form.errors.email }}</div>
                        </div>
                        <div class="col-12">
                            <div class="password-field position-relative">
                                <InputLabel for="formSignupPassword" class="form-label visually-hidden">Password</InputLabel>
                                <div class="password-field position-relative">
                                    <TextInput v-model="form.password" type="password" name="password" class="form-control fakePassword" id="formSignupPassword" placeholder="*****" required="required" />
                                    <span><i class="bi bi-eye-slash passwordToggler"></i></span>
                                    <div v-if="validationErrors.password || form.errors.password" class="invalid-feedback">{{ validationErrors.password || form.errors.password }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="password-field position-relative">
                                <InputLabel for="formSignupPasswordConfirmation" class="form-label visually-hidden">Confirm Password <span class="text-danger">*</span></InputLabel>
                                <div class="password-field position-relative">
                                    <TextInput v-model="form.password_confirmation" type="password" name="password_confirmation" class="form-control" :class="{ 'is-invalid': validationErrors.password_confirmation || form.errors.password_confirmation }"id="formSignupPasswordConfirmation" placeholder="Confirm Password" />
                                    <span><i class="bi bi-eye-slash passwordToggler"></i></span>
                                    <div v-if="validationErrors.password_confirmation || form.errors.password_confirmation" class="invalid-feedback d-block">
                                        {{ validationErrors.password_confirmation || form.errors.password_confirmation }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- btn -->
                        <div class="col-12 d-grid">
                            <Button type="submit" class="btn btn-primary" :disabled="form.processing">{{ form.processing ? 'Registering...' : 'Register' }}</Button>
                        </div>

                        <!-- text -->
                        <p>
                            <small>
                            By continuing, you agree to our
                            <a href="#!">Terms of Service</a>
                            &
                            <a href="#!">Privacy Policy</a>
                            </small>
                        </p>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </section>
        </main>
    </AppLayout>
</template>