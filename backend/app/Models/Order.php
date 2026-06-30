<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'outlet_id', 'cashier_session_id', 'user_id', 'order_number',
        'customer_name', 'subtotal', 'discount', 'tax', 'total',
        'payment_method', 'payment_status', 'order_status',
        'is_offline_created', 'offline_uuid', 'synced_at', 'has_sync_conflict',
        'idempotency_key',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'is_offline_created' => 'boolean',
        'has_sync_conflict' => 'boolean',
        'synced_at' => 'datetime',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function cashierSession(): BelongsTo
    {
        return $this->belongsTo(CashierSession::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(OrderRefund::class);
    }

    public function syncConflictLogs(): HasMany
    {
        return $this->hasMany(SyncConflictLog::class);
    }
}
