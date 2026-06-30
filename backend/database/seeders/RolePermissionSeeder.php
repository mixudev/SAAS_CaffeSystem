<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

/**
 * Seeder pondasi RBAC sesuai SRS Bagian 3 (Spesifikasi Pengguna dan Peran).
 * Menjalankan: php artisan db:seed --class=RolePermissionSeeder
 */
class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // POS
            'pos.order.create', 'pos.order.refund', 'pos.session.open', 'pos.session.close',
            // Inventory
            'inventory.view', 'inventory.adjust', 'inventory.purchase',
            // HR
            'hr.shift.manage', 'hr.attendance.view', 'hr.leave.request', 'hr.leave.approve',
            // Payroll
            'payroll.view', 'payroll.generate', 'payroll.approve',
            // Reporting
            'report.view', 'report.export',
            // User & Role management
            'user.manage', 'role.manage', 'audit.view',
        ];

        $permissionModels = collect($permissions)->mapWithKeys(function (string $name) {
            return [$name => Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web'])];
        });

        $roleMatrix = [
            'cashier' => ['pos.order.create', 'pos.session.open', 'pos.session.close', 'hr.leave.request'],
            'staff' => ['hr.leave.request'],
            'manager' => [
                'pos.order.create', 'pos.order.refund', 'pos.session.open', 'pos.session.close',
                'inventory.view', 'inventory.adjust', 'inventory.purchase',
                'hr.shift.manage', 'hr.attendance.view', 'hr.leave.approve',
                'report.view', 'report.export',
            ],
            'finance' => ['payroll.view', 'payroll.generate', 'report.view', 'report.export'],
            'owner' => $permissions, // akses penuh
        ];

        foreach ($roleMatrix as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->permissions()->sync(
                collect($rolePermissions)->map(fn ($p) => $permissionModels[$p]->id)
            );
        }
    }
}
