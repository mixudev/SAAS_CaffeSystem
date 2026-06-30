<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockPurchase extends Model
{
    protected $fillable = [
        'outlet_id', 'supplier_id', 'raw_material_id', 'quantity',
        'purchase_price_per_unit', 'total_price', 'purchased_at',
        'invoice_number', 'created_by',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'purchase_price_per_unit' => 'decimal:2',
        'total_price' => 'decimal:2',
        'purchased_at' => 'date',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function rawMaterial(): BelongsTo
    {
        return $this->belongsTo(RawMaterial::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
