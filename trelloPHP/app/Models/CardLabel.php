<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasHexId;

class CardLabel extends Model
{
    use HasHexId;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'card_id', 'name', 'color'];

    public function card()
    {
        return $this->belongsTo(Card::class, 'card_id');
    }
}
