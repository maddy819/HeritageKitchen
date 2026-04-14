<?php
// app/Http/Controllers/Auth/VerifyEmailController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, $id, $hash)
    {
        // Find the user by ID instead of using $request->user()
        $user = User::findOrFail($id);

        // Verify the hash matches the user's email
        if (!hash_equals(sha1($user->getEmailForVerification()), (string) $hash)) {
            abort(403, 'Invalid verification link.');
        }

        // Check if email is already verified
        if ($user->hasVerifiedEmail()) {
            // Redirect based on role
            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('customer.dashboard');
        }

        // Mark email as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Log the user in after verification
        auth()->login($user);

        // Redirect based on role
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard')->with('verified', true);
        }

        return redirect()->route('customer.dashboard')->with('verified', true);
    }
}