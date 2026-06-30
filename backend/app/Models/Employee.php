<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'outlet_id', 'employee_code', 'full_name', 'nik', 'address', 'phone',
        'birth_date', 'hire_date', 'termination_date', 'position',
        'employment_type', 'wage_type', 'base_wage', 'bank_account',
        'annual_leave_quota', 'is_active',
    ];

    protected $casts = [
        // Data sensitif dienkripsi otomatis at-rest sesuai SEC-06.
        'nik' => 'encrypted',
        'address' => 'encrypted',
        'bank_account' => 'encrypted',
        'birth_date' => 'date',
        'hire_date' => 'date',
        'termination_date' => 'date',
        'base_wage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }

    public function attendanceLogs(): HasMany
    {
        return $this->hasMany(AttendanceLog::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function shiftSchedules(): HasMany
    {
        return $this->hasMany(EmployeeShiftSchedule::class);
    }

    public function payrollRecords(): HasMany
    {
        return $this->hasMany(PayrollRecord::class);
    }

    /** Sisa kuota cuti tahunan berjalan (FR-HR-05) */
    public function getRemainingLeaveQuotaAttribute(): int
    {
        $usedDays = $this->leaveRequests()
            ->where('leave_type', 'annual')
            ->where('status', 'approved')
            ->whereYear('start_date', now()->year)
            ->sum('total_days');

        return max(0, $this->annual_leave_quota - $usedDays);
    }
}
