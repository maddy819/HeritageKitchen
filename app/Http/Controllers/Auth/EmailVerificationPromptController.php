<?php
// app/Http/Controllers/Auth/EmailVerificationPromptController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EmailVerificationPromptController extends Controller
{
    public function __invoke()
    {
        // If already verified, redirect to dashboard
        // if (auth()->user()->hasVerifiedEmail()) {
        //     $user = auth()->user();

        //     if ($user->isAdmin()) {
        //         return redirect()->intended(route('admin.dashboard'));
        //     }

        //     return redirect()->intended(route('customer.dashboard'));
        // }

        // Show verification notice page
        return Inertia::render('Auth/VerifyEmail');
    }
}