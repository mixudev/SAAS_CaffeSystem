<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EmployeeShiftSchedule extends Model
{
    protected $table = 'employee_shift_schedules';

    protected $fillable = [
        'outlet_id', 'employee_id', 'shift_id', 'date', 'status', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function attendanceLog(): HasOne
    {
        return $this->hasOne(AttendanceLog::class, 'employee_shift_schedule_id');
    }
}
