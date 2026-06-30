<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SyncConflictLog extends Model
{
    protected $table = 'sync_conflict_logs';

    protected $fillable = [
        'outlet_id', 'order_id', 'offline_uuid', 'conflict_type', 'details',
        'is_resolved', 'resolved_by', 'resolved_at',
    ];

    protected $casts = [
        'details' => 'array',
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
