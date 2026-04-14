<!-- resources/js/Pages/Auth/ForgotPassword.vue -->
<script setup>
import { Link, useForm, usePage } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import { ref, computed, watch, onMounted } from 'vue';
import InputLabel from '@/Components/UI/InputLabel.vue';
import Button from '@/Components/UI/Button.vue';
import TextInput from '@/Components/UI/TextInput.vue';
import AppLayout from '@/Layouts/AppLayout.vue';

const page = usePage();
const validationErrors = ref({});

// Local reactive properties
const successMessage = ref(null);
const errorMessage = ref(null);
const emailSent = ref(false);
const sentEmail = ref('');

// Get flash messages from page props
const flashSuccess = computed(() => page.props.flash?.success);
const flashError = computed(() => page.props.flash?.error);
const flashResetEmail = computed(() => page.props.flash?.reset_email);

// Watch for flash messages from server
watch(flashSuccess, (newValue) => {
    console.log('Flash success changed:', newValue); // Debug log
    if (newValue) {
        successMessage.value = newValue;
        emailSent.value = true;
        sentEmail.value = flashResetEmail.value || form.email;
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            successMessage.value = null;
        }, 5000);
    }
});

watch(flashError, (newValue) => {
    console.log('Flash error changed:', newValue); // Debug log
    if (newValue) {
        errorMessage.value = newValue;
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.value = null;
        }, 5000);
    }
});

// Also check for flash messages on component mount
onMounted(() => {
    if (flashSuccess.value) {
        successMessage.value = flashSuccess.value;
        emailSent.value = true;
        sentEmail.value = flashResetEmail.value || '';
    }
    if (flashError.value) {
        errorMessage.value = flashError.value;
    }
});

const form = useForm({
    email: '',
});

// Frontend validation function
const validateForm = () => {
    const errors = {};
    
    if (!form.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    validationErrors.value = errors;
    return Object.keys(errors).length === 0;
};

const submit = () => {
    // Clear previous messages and errors
    successMessage.value = null;
    errorMessage.value = null;
    validationErrors.value = {};
    form.clearErrors();
    
    // Frontend validation
    if (!validateForm()) {
        return;
    }

    form.post(route('password.email'), {
        preserveScroll: true,
        onSuccess: (response) => {
            console.log('Success response:', response); // Debug log
            
            // The flash messages will be automatically picked up by the watchers
            // But we can also set them directly
            if (response.props.flash?.success) {
                successMessage.value = response.props.flash.success;
                emailSent.value = true;
                sentEmail.value = response.props.flash?.reset_email || form.email;
            }
            
            // Reset the form email field after successful submission
            form.reset('email');
        },
        onError: (errors) => {
            console.error('Failed to send password reset email:', errors);
            
            if (errors.email) {
                errorMessage.value = errors.email;
            } else {
                errorMessage.value = 'Failed to send reset link. Please try again.';
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
    });
};
</script>

<template>
    <AppLayout>
        <section class="my-lg-14 my-8">
            <div class="container">
                <div class="row justify-content-center align-items-center">
                    <div class="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                        <img src="/assets/images/svg-graphics/fp-g.svg" alt="" class="img-fluid" />
                    </div>
                    
                    <div class="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1 d-flex align-items-center">
                        <div class="w-100">
                            <div class="mb-lg-9 mb-5">
                                <h1 class="mb-2 h2 fw-bold">Forgot your password?</h1>
                                <p>Please enter the email address associated with your account and We will email you a link to reset your password.</p>
                            </div>

                            <!-- Validation Error Summary -->
                            <div v-if="Object.keys(validationErrors).length > 0 || Object.keys(form.errors).length > 0" class="alert alert-danger mb-4">
                                <strong>Please fix the following errors:</strong>
                                <ul class="mb-0 mt-2">
                                    <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                                    <li v-for="error in form.errors" :key="error">{{ error }}</li>
                                </ul>
                            </div>

                            <!-- Success Message Alert -->
                            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mb-4" role="alert">
                                <div class="d-flex">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-check-circle-fill fs-5"></i>
                                    </div>
                                    <div class="ms-2">
                                        <strong>Success!</strong> {{ successMessage }}
                                        <div v-if="emailSent && sentEmail" class="mt-1 small">
                                            We sent the reset link to: <strong>{{ sentEmail }}</strong>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn-close" @click="successMessage = null"></button>
                            </div>

                            <!-- Error Message Alert -->
                            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                                <div class="d-flex">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-exclamation-triangle-fill fs-5"></i>
                                    </div>
                                    <div class="ms-2">
                                        <strong>Error!</strong> {{ errorMessage }}
                                    </div>
                                </div>
                                <button type="button" class="btn-close" @click="errorMessage = null"></button>
                            </div>

                            <!-- Form -->
                            <form @submit.prevent="submit" class="needs-validation" novalidate>
                                <div class="row g-3">
                                    <div class="col-12">
                                        <InputLabel for="formForgetEmail" class="form-label visually-hidden">Email address</InputLabel>
                                        <TextInput
                                            id="formForgetEmail"
                                            type="email"
                                            name="email"
                                            class="form-control"
                                            :class="{ 'is-invalid': validationErrors.email || form.errors.email }"
                                            placeholder="Email"
                                            v-model="form.email"
                                            required
                                            :disabled="form.processing"
                                        />
                                        <div v-if="validationErrors.email || form.errors.email" class="invalid-feedback">
                                            {{ validationErrors.email || form.errors.email }}
                                        </div>
                                    </div>

                                    <div class="col-12 d-grid gap-2">
                                        <Button 
                                            type="submit" 
                                            class="btn btn-primary" 
                                            :disabled="form.processing"
                                        >
                                            <span v-if="form.processing" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                            {{ form.processing ? 'Sending reset link...' : 'Send Reset Link' }}
                                        </Button>
                                        <Link :href="route('login')" class="btn btn-light">Back to Login</Link>
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