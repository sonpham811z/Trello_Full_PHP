<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasHexId;

class CardChecklist extends Model
{
    use HasHexId;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'card_id', 'title'];

    public function items()
    {
        return $this->hasMany(ChecklistItem::class, 'checklist_id');
    }
}



