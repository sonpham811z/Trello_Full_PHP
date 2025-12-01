<?php

namespace App\Providers;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CloudinaryProvider
{
    public static function upload($file, $folder = 'user-avatar')
    {
        $upload = Cloudinary::upload($file->getRealPath(), [
            'folder' => $folder
        ]);

        return [
            'secure_url' => $upload->getSecurePath(),
            'public_id'  => $upload->getPublicId(),
        ];
    }
}
