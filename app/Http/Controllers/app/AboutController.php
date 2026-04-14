<?php

namespace App\Http\Controllers\app;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    /**
     * Show the about page.
     */
    public function index()
    {
        return Inertia::render('About', [
            'user' => auth()->user()
        ]);
    }
}