<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;


class AddCategoryController extends Controller
{
    /**
     * Show the home page.
     */
    public function index()
    {
        return Inertia::render('Admin/AddCategory', [
            'categories' => Category::with('children')->get(), // Get ALL categories
        ]);
    }

    public function store(Request $request)
    {
        try {
            $isUpdate = $request->has('id') && !empty($request->id);

            $rules = [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'parent_id' => 'nullable|exists:categories,id',
                'status' => 'required|in:0,1',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ];

            // Add unique validation for name with exception for current category on update
            if ($isUpdate) {
                $rules['name'] .= '|unique:categories,name,' . $request->id;
            } else {
                $rules['name'] .= '|unique:categories,name';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Generate slug from category name
            $slug = \Str::slug($request->name);

            // Check if slug already exists and make it unique
            $originalSlug = $slug;
            $counter = 1;

            $slugQuery = Category::where('slug', $slug);
            if ($isUpdate) {
                $slugQuery->where('id', '!=', $request->id);
            }

            while ($slugQuery->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $slugQuery = Category::where('slug', $slug);
                if ($isUpdate) {
                    $slugQuery->where('id', '!=', $request->id);
                }
                $counter++;
            }

            $categoryData = [
                'name' => $request->name,
                'slug' => $slug,
                'description' => $request->description,
                'parent_id' => $request->parent ?: null, // Use 'parent' field from your form
                'is_active' => $request->status,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
            ];

            if ($isUpdate) {
                $category = Category::findOrFail($request->id);
                $category->update($categoryData);
                $message = 'Category updated successfully';
            } else {
                $category = Category::create($categoryData);
                $message = 'Category created successfully';
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    // Generate unique name
                    $timestamp = time();
                    $random = rand(100000, 999999);
                    $filename = $timestamp . '_' . $random . '_' . $file->getClientOriginalName();

                    // Store in storage/app/public/categories
                    $path = $file->storeAs('categories', $filename, 'public');

                    // Create record in category_images table
                    CategoryImage::create([
                        'category_id' => $category->id,
                        'image' => $filename,
                        'name' => $file->getClientOriginalName(),
                        'imagetype' => $file->getClientOriginalExtension(),
                        'imageurl' => '/storage/' . $path, // Store relative path
                        'imagesize' => $file->getSize(),
                    ]);
                }
            }

            // If you want to handle image deletions (for updates)
            if ($isUpdate && $request->has('deleted_images')) {
                $deletedImages = json_decode($request->deleted_images, true);
                if (is_array($deletedImages) && count($deletedImages) > 0) {
                    foreach ($deletedImages as $imageId) {
                        $image = CategoryImage::find($imageId);
                        if ($image) {
                            // Delete file from storage
                            $filePath = storage_path('app/public/categories/' . $image->image);
                            if (file_exists($filePath)) {
                                unlink($filePath);
                            }
                            $image->delete();
                        }
                    }
                }
            }

            return response()->json([
                'message' => $message,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Category store/update error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'An error occurred while processing your request: ' . $e->getMessage(),
            ], 500);
        }
    }
}