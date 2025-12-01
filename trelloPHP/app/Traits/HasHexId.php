<?php

namespace App\Traits;

trait HasHexId
{
    public static function bootHasHexId()
    {
        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = self::generateHexId();
            }
        });
    }

    public static function generateHexId()
    {
        return bin2hex(random_bytes(12));
    }
}
