<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceLog extends Model
{
    protected $fillable = [
        'outlet_id', 'employee_id', 'employee_shift_schedule_id',
        'clock_in_at', 'clock_out_at',
        'clock_in_lat', 'clock_in_lng', 'clock_out_lat', 'clock_out_lng',
        'verification_method', 'is_late', 'late_minutes', 'status', 'notes',
    ];

    protected $casts = [
        'clock_in_at' => 'datetime',
        'clock_out_at' => 'datetime',
        'is_late' => 'boolean',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function shiftSchedule(): BelongsTo
    {
        return $this->belongsTo(EmployeeShiftSchedule::class, 'employee_shift_schedule_id');
    }

    /** Total jam kerja pada log ini, dipakai perhitungan payroll (FR-PAY-01) */
    public function getWorkedHoursAttribute(): float
    {
        if (!$this->clock_in_at || !$this->clock_out_at) {
            return 0.0;
        }

        return round($this->clock_in_at->diffInMinutes($this->clock_out_at) / 60, 2);
    }
}
