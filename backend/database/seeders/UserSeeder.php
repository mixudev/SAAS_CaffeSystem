<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Owner CAFFE',
                'username' => 'owner',
                'email' => 'owner@caffe.app',
                'role' => 'owner',
            ],
            [
                'name' => 'Manager Cafe',
                'username' => 'manager',
                'email' => 'manager@caffe.app',
                'role' => 'manager',
            ],
            [
                'name' => 'Kasir Cafe',
                'username' => 'kasir',
                'email' => 'cashier@caffe.app',
                'role' => 'cashier',
            ],
            [
                'name' => 'Staff Cafe',
                'username' => 'staff',
                'email' => 'staff@caffe.app',
                'role' => 'staff',
            ],
            [
                'name' => 'Finance Cafe',
                'username' => 'finance',
                'email' => 'finance@caffe.app',
                'role' => 'finance',
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'username' => $data['username'],
                    'password' => 'password',
                    'is_active' => true,
                ]
            );

            $user->syncRoles([$data['role']]);
        }

        $this->command->info('Test users created:');
        $this->command->info('  Semua password: password');
        foreach ($users as $data) {
            $this->command->info("  {$data['email']} / {$data['username']} ({$data['role']})");
        }
    }
}
