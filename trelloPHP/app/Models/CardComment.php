<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CardComment extends Model
{
    use HasFactory;

    protected $table = 'card_comments';

    protected $fillable = [
        'card_id', 'user_id', 'user_email', 'user_avatar', 'user_display_name', 'content', 'commented_at'
    ];

    public $timestamps = false;

    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
