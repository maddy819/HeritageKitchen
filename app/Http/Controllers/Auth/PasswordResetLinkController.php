<?php
// app/Http/Controllers/Auth/PasswordResetLinkController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    // Show forgot password page
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    // Send password reset link
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.exists' => 'We could not find a user with that email address.',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return redirect()->back()->with([
                'success' => 'We have emailed your password reset link! Please check your inbox.',
                'reset_email' => $request->email,
                'email_sent' => true,
            ]);
        }

        return redirect()->back()->withErrors([
            'error' => 'Unable to send reset link. Please try again later.',
        ]);
    }
}