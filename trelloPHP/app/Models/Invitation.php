<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasHexId;

class Invitation extends Model
{
    use HasFactory, HasHexId;

    // BẮT BUỘC CHO HỆ THỐNG HEX ID
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'inviter_id',
        'invitee_id',
        'type',
        'board_id',
        'status'
    ];

    // Quan hệ
    public function inviter()
    {
        return $this->belongsTo(User::class, 'inviter_id');
    }

    public function invitee()
    {
        return $this->belongsTo(User::class, 'invitee_id');
    }

    public function board()
    {
        return $this->belongsTo(Board::class, 'board_id');
    }
}
