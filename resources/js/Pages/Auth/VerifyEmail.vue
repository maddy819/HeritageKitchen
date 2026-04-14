<!-- resources/js/Pages/Auth/VerifyEmail.vue -->
<script setup>
import { computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PrimaryButton from '@/Components/UI/Button.vue';
import Button from '@/Components/UI/Button.vue';

const props = defineProps({
    status: String,
});

const form = useForm({});

const verificationLinkSent = computed(() => props.status === 'verification-link-sent');

const submit = () => {
    form.post(route('verification.send'));
};
</script>

<template>
    <AppLayout>
        <main>
            <Head title="Email Verification" />

            <section class="my-lg-14 my-8">
                <div class="container">
                    <div class="row justify-content-center align-items-center">
                        <p>Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.</p>
                        
                        <div v-if="verificationLinkSent">
                            A new verification link has been sent to the email address you provided during registration.
                        </div>

                        <form @submit.prevent="submit">
                            <div class="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                                <Button class="btn btn-primary" :disabled="form.processing">
                                    Resend Verification Email
                                </Button>

                                <Link 
                                    :href="route('logout')"
                                    method="post"
                                    as="button"
                                    class="btn btn-secondary"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </form>
                        
                        <div>
                            <p class="d-flex justify-content-between">
                                Check your mailtrap.io inbox for verification email.
                            </p>
                        </div>
                    </div>
                </div>

                

                
            </section>
        </main>
    </AppLayout>
</template>