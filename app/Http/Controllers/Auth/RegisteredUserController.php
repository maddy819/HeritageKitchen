<?php
// app/Http/Controllers/Auth/RegisteredUserController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    // Show registration page
    public function create()
    {
        return Inertia::render('Signup');
    }

    // Handle registration
    public function store(Request $request)
    {
        // Debug: Log incoming request
        \Log::info('Registration attempt:', $request->all());

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->firstname . ' ' . $request->lastname,
            'email' => $request->email,
            'password' => $request->password, // Model automatically hashes this
            'role' => 'customer', // Default role
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Debug: Log success
        \Log::info('User registered successfully:', ['id' => $user->id, 'email' => $user->email]);

        // Redirect to email verification notice page
        return redirect()->route('verification.notice');
    }
}