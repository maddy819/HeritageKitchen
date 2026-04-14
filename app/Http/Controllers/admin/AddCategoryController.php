<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AddCategoryController extends Controller
{
    /**
     * Show the home page.
     */
    public function index()
    {
        return Inertia::render('Admin/AddCategory', [
            'user' => auth()->user(),
            'stats' => [
                'total_users' => User::count(),
                'customers' => User::where('role', 'customer')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
    }
}