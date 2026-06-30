<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Requests\LoginRequest;
use App\Models\LoginAttempt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $login = $credentials['login'];
        $password = $credentials['password'];
        $ip = $request->ip();
        $userAgent = $request->userAgent();

        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($field, $login)->with('roles')->first();

        if (!$user || !Hash::check($password, $user->password)) {
            LoginAttempt::create([
                'email' => $login,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'successful' => false,
            ]);

            return response()->json([
                'message' => 'Email/Username atau kata sandi salah.',
            ], 401);
        }

        if (!$user->is_active) {
            LoginAttempt::create([
                'email' => $login,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'successful' => false,
            ]);

            return response()->json([
                'message' => 'Akun Anda telah dinonaktifkan. Hubungi administrator.',
            ], 403);
        }

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);

        $role = $user->roles()->first();
        $abilities = $role ? ['role:' . $role->name] : [];

        $token = $user->createToken('auth-token', $abilities)
            ->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'outlet_id' => $user->outlet_id,
                    'is_active' => $user->is_active,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles');

        return response()->json([
            'message' => 'Data pengguna berhasil diambil.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'outlet_id' => $user->outlet_id,
                'is_active' => $user->is_active,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        $role = $user->roles()->first();
        $abilities = $role ? ['role:' . $role->name] : [];

        $token = $user->createToken('auth-token', $abilities)
            ->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }
}
