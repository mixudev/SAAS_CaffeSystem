<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollRecord extends Model
{
    protected $fillable = [
        'payroll_period_id', 'employee_id', 'outlet_id',
        'base_salary', 'total_work_hours', 'overtime_hours', 'overtime_amount',
        'allowances_total', 'bonus_total', 'late_penalty_total', 'deductions_total',
        'gross_salary', 'net_salary', 'status', 'slip_pdf_path',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
        'total_work_hours' => 'decimal:2',
        'overtime_hours' => 'decimal:2',
        'overtime_amount' => 'decimal:2',
        'allowances_total' => 'decimal:2',
        'bonus_total' => 'decimal:2',
        'late_penalty_total' => 'decimal:2',
        'deductions_total' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    public function payrollPeriod(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PayrollRecordItem::class);
    }

    /** Hitung ulang gross & net berdasarkan item-item komponen gaji (FR-PAY-02) */
    public function recalculateTotals(): void
    {
        $this->allowances_total = $this->items()->where('type', 'allowance')->sum('amount');
        $this->bonus_total = $this->items()->where('type', 'bonus')->sum('amount');
        $this->overtime_amount = $this->items()->where('type', 'overtime')->sum('amount');
        $this->late_penalty_total = $this->items()->where('type', 'penalty')->sum('amount');
        $this->deductions_total = $this->items()->where('type', 'deduction')->sum('amount');

        $this->gross_salary = $this->base_salary + $this->allowances_total
            + $this->bonus_total + $this->overtime_amount;

        $this->net_salary = $this->gross_salary - $this->deductions_total - $this->late_penalty_total;

        $this->save();
    }
}
