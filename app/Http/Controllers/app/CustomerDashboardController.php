<?php
// app/Http/Controllers/Customer/DashboardController.php

namespace App\Http\Controllers\app;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Customer/Dashboard', [
            'user' => auth()->user(),
        ]);
    }
}