<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
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
            'categories' => Category::with('children')->get(), // Get ALL categories
            'stats' => [
                'total_users' => User::count(),
                'customers' => User::where('role', 'customer')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $uploadedFiles = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                // generate unique name
                $filename = time() . '_' . $file->getClientOriginalName();

                // store in storage/app/public/categories
                $path = $file->storeAs('categories', $filename, 'public');

                $uploadedFiles[] = [
                    'name' => $filename,
                    'path' => $path,
                    'url' => asset('storage/' . $path)
                ];
            }
        }

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $request->all(),
            'files' => $uploadedFiles
        ]);
    }
}