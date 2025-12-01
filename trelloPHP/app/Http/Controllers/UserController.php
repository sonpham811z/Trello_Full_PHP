<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    protected $userService;
    public function __construct(UserService $userService) { $this->userService = $userService; }

    public function register(Request $request) {
        $user = $this->userService->createNew($request->all());
        return response()->json($user, 201);
    }

    public function verify(Request $request) {
        $user = $this->userService->verify($request->all());
        return response()->json($user);
    }

    public function login(Request $request) {
        $data = $this->userService->login($request->all());
        return response()->json($data);
    }

    public function update(Request $request) {
        $user = Auth::user();



        $updated = $this->userService->updateUser($user, $request->all(), $request->file('avatar'));
        return response()->json($updated);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        // Xoá token hiện tại
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

}
