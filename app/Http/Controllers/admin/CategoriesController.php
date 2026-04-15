<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    /**
     * Show the categories page.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $status = $request->input('status', '');

        $categories = Category::with(['children', 'mainImage'])
            ->when($search !== '', function ($query) use ($search) {
                return $query->where('name', 'like', "%{$search}%");
            })->when($status !== '' && $status !== null, function ($query) use ($status) {
                return $query->where('is_active', $status);
            })->orderBy('parent_id')->orderBy('name')->paginate(5)->withQueryString();

        return Inertia::render('Admin/Categories', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Delete a category.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully');
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id'
        ]);

        Category::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Categories deleted successfully');
    }
}
