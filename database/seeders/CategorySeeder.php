<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Create 10 parent categories
        $parents = Category::factory()
            ->count(2)
            ->parent()
            ->active()
            ->create();

        // Create 3-5 sub-categories for each parent
        foreach ($parents as $parent) {
            Category::factory()
                ->count(2)
                ->child($parent->id)
                ->create();
        }

        // Create some inactive categories
        Category::factory()
            ->count(2)
            ->inactive()
            ->create();
    }
}