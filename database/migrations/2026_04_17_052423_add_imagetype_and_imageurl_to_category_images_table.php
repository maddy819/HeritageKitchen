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
        Schema::table('category_images', function (Blueprint $table) {
            // Add imagetype column (e.g., 'jpg', 'png', 'webp')
            $table->string('imagetype', 50)->nullable()->after('image'); // or after a specific column
            // Add imageurl column
            $table->string('imageurl')->nullable()->after('imagetype');
            // add imagesize column if needed
            $table->integer('imagesize')->nullable()->after('imageurl');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_images', function (Blueprint $table) {
            // Drop both columns if rolling back
            $table->dropColumn(['imagetype', 'imageurl', 'imagesize']);
        });
    }
};
