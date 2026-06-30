<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashierSession extends Model
{
    protected $fillable = [
        'outlet_id', 'user_id', 'opening_cash', 'closing_cash_system',
        'closing_cash_actual', 'cash_difference', 'opened_at', 'closed_at',
        'status', 'notes',
    ];

    protected $casts = [
        'opening_cash' => 'decimal:2',
        'closing_cash_system' => 'decimal:2',
        'closing_cash_actual' => 'decimal:2',
        'cash_difference' => 'decimal:2',
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** FR-POS-06: hitung selisih kas sistem vs fisik saat tutup sesi */
    public function calculateDifference(): float
    {
        return round(($this->closing_cash_actual ?? 0) - ($this->closing_cash_system ?? 0), 2);
    }
}
