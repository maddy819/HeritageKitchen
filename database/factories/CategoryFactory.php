<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $adjectives = ['Men', 'Women', 'Kids', 'Smart', 'Organic', 'Modern'];
        $nouns = ['Clothing', 'Accessories', 'Electronics', 'Furniture', 'Products', 'Appliances'];

        $name = $this->faker->unique()->bothify(
            $this->faker->randomElement($adjectives) . ' ' .
            $this->faker->randomElement($nouns) . ' ##'
        );

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'parent_id' => null,
            'is_active' => $this->faker->numberBetween(1, 100) <= 80 ? 1 : 0,
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->paragraph(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    // State for active categories
    public function active(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => 1,
        ]);
    }

    // State for inactive categories
    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => 0,
        ]);
    }

    // State for parent categories
    public function parent(): static
    {
        return $this->state(fn(array $attributes) => [
            'parent_id' => null,
        ]);
    }

    // State for child categories
    public function child($parentId): static
    {
        return $this->state(fn(array $attributes) => [
            'parent_id' => $parentId,
        ]);
    }
}