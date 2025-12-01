<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasHexId;

class Board extends Model
{
    use HasFactory, HasHexId;

    public $incrementing = false;    
    protected $keyType = 'string';           

    protected $fillable = [
        'id',
        'owner_id',
        'title',
        'slug',
        'description',
        'type',
        'column_order_ids'
    ];

    protected $casts = [
        'column_order_ids' => 'array',
    ];

    // Quan hệ
    public function owner() 
    { 
        return $this->belongsTo(User::class, 'owner_id'); 
    }

    public function members() 
    {
        return $this->belongsToMany(User::class, 'board_user', 'board_id', 'user_id')
                    ->withTimestamps();
    }

    public function columns() 
    {
        return $this->hasMany(Column::class, 'board_id');
    }

    public function cards() 
    { 
        return $this->hasMany(Card::class, 'board_id'); 
    }
}
