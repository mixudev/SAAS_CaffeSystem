<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RawMaterial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'outlet_id', 'name', 'unit', 'current_stock', 'min_stock_threshold',
        'cost_per_unit', 'is_active',
    ];

    protected $casts = [
        'current_stock' => 'decimal:3',
        'min_stock_threshold' => 'decimal:3',
        'cost_per_unit' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function recipes(): HasMany
    {
        return $this->hasMany(ProductRecipe::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function stockPurchases(): HasMany
    {
        return $this->hasMany(StockPurchase::class);
    }

    /** FR-INV-05: apakah stok sudah di bawah ambang minimum */
    public function getIsLowStockAttribute(): bool
    {
        return $this->current_stock <= $this->min_stock_threshold;
    }
}
