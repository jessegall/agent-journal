<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Attachments;

use Domain\Documents\Enums\UploadType;

interface SealedUploads
{
    public function consume(string $uploadId, UploadType $type): string;
}
