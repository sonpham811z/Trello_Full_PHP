<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Carbon\Carbon;
use Cloudinary\Cloudinary;



use Exception;

class UserService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        // Khởi tạo Cloudinary đúng cách
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ]
        ]);
    }
    /**
     * Đăng ký tài khoản mới
     */
    public function createNew(array $data): User
    {
        // Kiểm tra email trùng
        $exists = User::where('email', $data['email'])->first();
        if ($exists) {
            if (!$exists->is_active) {
                // nếu chưa active, reset token & hạn
                $exists->verify_token = Str::uuid();
                $exists->token_link_expiration = Carbon::now()->addMinutes(15);
                $exists->password = Hash::make($data['password']);
                $exists->save();

                $this->sendVerifyEmail($exists);
                return $exists;
            }
            throw new Exception('Email is already being used !!!', 409);
        }

        // Tạo user mới
        $name = explode('@', $data['email'])[0];
        $user = User::create([
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'username' => $name,
            'display_name' => $name,
            'verify_token' => Str::uuid(),
            'token_link_expiration' => Carbon::now()->addMinutes(15),
        ]);

        $this->sendVerifyEmail($user);
        return $user;
    }

    /**
     * Gửi mail xác thực
     */
    private function sendVerifyEmail(User $user)
    {
        $verifyUrl = config('app.url') . "/account/verification?email={$user->email}&token={$user->verify_token}";
        $subject = 'TrelloPHP: Verify your account';

        Mail::send('emails.verify', ['url' => $verifyUrl, 'user' => $user], function ($m) use ($user, $subject) {
            $m->to($user->email)->subject($subject);
        });
    }

    /**
     * Xác thực tài khoản qua token
     */
    public function verify(array $data): User
    {
        $user = User::where('email', $data['email'])->first();
        if (!$user) throw new Exception('Account not found !!!', 404);
        if ($user->is_active) throw new Exception('Account is already active', 406);
        if (Carbon::now()->gt($user->token_link_expiration)) throw new Exception('Your link is expired', 400);
        if ($data['token'] !== $user->verify_token) throw new Exception('Invalid token', 401);

        $user->update([
            'is_active' => true,
            'verify_token' => null,
            'token_link_expiration' => null
        ]);
        return $user;
    }

    /**
     * Đăng nhập user
     */
    public function login(array $data)
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            throw new Exception('Account not found', 404);
        }

        if (!$user->is_active) {
            throw new Exception('Please verify your account', 406);
        }

        if (!Hash::check($data['password'], $user->password)) {
            throw new Exception('Email or password is incorrect', 406);
        }

        // Tạo sanctum token
        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user
        ];
    }


    /**
     * Cập nhật thông tin hoặc avatar
     */
    public function updateUser(User $user, array $data, $avatarFile): User
    {
        if (isset($data['new_password'], $data['current_password'])) {
            if (!Hash::check($data['current_password'], $user->password)) {
                echo "con";
                throw new Exception('Current password is incorrect', 406);
            }
            $user->password = Hash::make($data['new_password']);
        } elseif ($avatarFile) {
            $result = $this->cloudinary->uploadApi()->upload(
                $avatarFile->getRealPath(),
                ["folder" => "userAvatar"]
            );
            $user->avatar = $result['secure_url'];


        } else {
            
            $user->fill($data);
        }
        $user->save();
        return $user;
    }
}
