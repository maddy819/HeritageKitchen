<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoryImage extends Model
{
    use HasFactory;

    protected $table = 'category_images';

    protected $fillable = [
        'category_id',
        'image',
    ];

    protected $casts = [
        'category_id' => 'integer',
    ];

    /**
     * Get the category that owns the image
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the full URL for the image
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // If using public storage
        return asset('storage/' . $this->image);

        // If using URL directly
        // return $this->image;
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Delete image file when model is deleted
        static::deleting(function ($image) {
            if ($image->image && \Storage::exists($image->image)) {
                \Storage::delete($image->image);
            }
        });
    }
}