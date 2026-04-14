<?php
// app/Http/Middleware/EnsureEmailIsVerified.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::user() || Auth::user()->hasVerifiedEmail()) {
            return $next($request);
        }

        return redirect()->route('verification.notice');
    }
}