<?php

namespace App\Http\Controllers\app;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Show the contact page.
     */
    public function index()
    {
        return Inertia::render('ContactUs', [
            'user' => auth()->user()
        ]);
    }
}