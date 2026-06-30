<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // POS
            'pos.order.create' => 'Membuat transaksi penjualan POS',
            'pos.order.refund' => 'Melakukan refund/retur pesanan',
            'pos.session.open' => 'Membuka sesi kasir',
            'pos.session.close' => 'Menutup sesi kasir',
            // Inventory
            'inventory.view' => 'Melihat stok bahan baku',
            'inventory.adjust' => 'Menyesuaikan stok bahan baku',
            'inventory.purchase' => 'Mencatat pembelian stok',
            // HR
            'hr.shift.manage' => 'Mengatur jadwal shift karyawan',
            'hr.attendance.view' => 'Melihat laporan absensi',
            'hr.leave.request' => 'Mengajukan cuti',
            'hr.leave.approve' => 'Menyetujui pengajuan cuti',
            // Payroll
            'payroll.view' => 'Melihat data payroll',
            'payroll.generate' => 'Menghasilkan payroll',
            'payroll.approve' => 'Menyetujui pembayaran payroll',
            // Reporting
            'report.view' => 'Melihat laporan',
            'report.export' => 'Mengekspor laporan',
            // User & Role management
            'user.manage' => 'Mengelola pengguna sistem',
            'role.manage' => 'Mengelola peran dan izin',
            'audit.view' => 'Melihat log audit sistem',
        ];

        foreach ($permissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                ['description' => $description]
            );
        }

        $roleMatrix = [
            'cashier' => [
                'description' => 'Kasir — staf operasional POS',
                'permissions' => ['pos.order.create', 'pos.session.open', 'pos.session.close', 'hr.leave.request'],
            ],
            'staff' => [
                'description' => 'Staf non-kasir — barista, kitchen, waiter',
                'permissions' => ['hr.leave.request'],
            ],
            'manager' => [
                'description' => 'Manager outlet — pengelola operasional harian',
                'permissions' => [
                    'pos.order.create', 'pos.order.refund', 'pos.session.open', 'pos.session.close',
                    'inventory.view', 'inventory.adjust', 'inventory.purchase',
                    'hr.shift.manage', 'hr.attendance.view', 'hr.leave.approve',
                    'report.view', 'report.export',
                ],
            ],
            'finance' => [
                'description' => 'Finance — staf keuangan dan payroll',
                'permissions' => ['payroll.view', 'payroll.generate', 'report.view', 'report.export'],
            ],
            'owner' => [
                'description' => 'Pemilik bisnis — akses penuh ke seluruh sistem',
                'permissions' => array_keys($permissions),
            ],
        ];

        foreach ($roleMatrix as $roleName => $config) {
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web'],
                ['description' => $config['description']]
            );
            $role->syncPermissions($config['permissions']);
        }
    }
}
