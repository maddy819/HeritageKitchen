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

            // Status control
            $table->integer('is_active')->default(1);

            $table->text('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

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
