<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\HasHexId;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasHexId;

    // BẮT BUỘC CHO HEX ID
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'email',
        'password',
        'username',
        'display_name',
        'avatar',
        'role',
        'is_active',
        'verify_token',
        'token_link_expiration',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'verify_token'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'token_link_expiration' => 'datetime',
    ];

    // === Quan hệ ===

    public function ownedBoards()
    {
        return $this->hasMany(Board::class, 'owner_id');
    }

    public function memberBoards()
    {
        return $this->belongsToMany(Board::class, 'board_user', 'user_id', 'board_id')
                    ->withTimestamps();
    }

    public function sentInvitations()
    {
        return $this->hasMany(Invitation::class, 'inviter_id');
    }

    public function receivedInvitations()
    {
        return $this->hasMany(Invitation::class, 'invitee_id');
    }

    public function cards()
    {
        return $this->belongsToMany(Card::class, 'card_user', 'user_id', 'card_id')
                    ->withTimestamps();
    }
}
