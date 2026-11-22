<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Contracts\Attachments\SealedUploads;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\DocumentBodyMissing;

final readonly class DocumentBody
{
    public function __construct(private SealedUploads $uploads) {}

    public function read(string|null $body, string|null $uploadId, UploadType $type): string
    {
        if ($body !== null && $uploadId === null) {
            return $body;
        }

        if ($body === null && $uploadId !== null) {
            return $this->uploads->consume($uploadId, $type);
        }

        throw DocumentBodyMissing::forInput();
    }
}
