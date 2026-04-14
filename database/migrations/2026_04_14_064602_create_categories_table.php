<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            // Basic category fields
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // For nested categories (parent-child relationship)
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('categories')
                ->onDelete('cascade');

            // For category ordering
            $table->integer('order')->default(0);

            // Status control
            $table->boolean('is_active')->default(true);

            // Optional: store category image path
            $table->string('image')->nullable();

            $table->timestamps();

            // Indexes for better performance
            $table->index('slug');
            $table->index('parent_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
