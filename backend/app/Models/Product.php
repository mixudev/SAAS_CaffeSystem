<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_category_id', 'sku', 'name', 'description', 'price', 'image_path', 'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function recipes(): HasMany
    {
        return $this->hasMany(ProductRecipe::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** Cek ketersediaan stok bahan baku untuk membuat $qty produk ini (FR-POS-05/FR-INV-03) */
    public function hasSufficientStock(int $qty = 1): bool
    {
        foreach ($this->recipes as $recipe) {
            $needed = $recipe->quantity_used * $qty;
            if ($recipe->rawMaterial->current_stock < $needed) {
                return false;
            }
        }

        return true;
    }
}
