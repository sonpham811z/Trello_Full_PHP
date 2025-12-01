<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasHexId;

class Card extends Model
{
    use HasFactory, HasHexId;

    public $incrementing = false;       // ID kiểu string, không auto increment
    protected $keyType = 'string';      // ID 24 hex (Mongo ObjectId)

    protected $fillable = [
        'id',
        'board_id',
        'column_id',
        'title',
        'description',
        'cover',
        'comments',
        'start_date','due_date','is_completed'
    ];

    protected $casts = [
        'comments' => 'array',
        'start_date'   => 'datetime',
        'due_date'     => 'datetime',
        'is_completed' => 'boolean',
    ];

    // Quan hệ
    public function board()
    {
        return $this->belongsTo(Board::class, 'board_id');
    }

    public function column()
    {
        return $this->belongsTo(Column::class, 'column_id');
    }

    // Members của Card
    public function members()
    {
        return $this->belongsToMany(User::class, 'card_user', 'card_id', 'user_id')
                    ->withTimestamps();
    }
    public function labels()
    {
        return $this->hasMany(CardLabel::class, 'card_id');
    }

    public function checklists()
    {
        return $this->hasMany(CardChecklist::class, 'card_id');
    }


}
