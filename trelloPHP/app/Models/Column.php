<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasHexId;

class Column extends Model
{
    use HasHexId;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'board_columns';

    protected $fillable = [
        'id',
        'board_id',
        'title',
        'description',
        'card_order_ids'
    ];

    protected $casts = [
        'card_order_ids' => 'array'
    ];

    public function cards()
    {
        return $this->hasMany(Card::class, 'column_id');
    }
}
