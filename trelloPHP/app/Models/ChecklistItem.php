<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasHexId;

class ChecklistItem extends Model
{
    use HasHexId;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'checklist_id', 'text', 'is_done'];
}
