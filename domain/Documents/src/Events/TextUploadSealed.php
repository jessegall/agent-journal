<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use Domain\Documents\Contracts\TextUploadEvent;

/**
 * A text upload was sealed: it takes no more chunks.
 */
final readonly class TextUploadSealed implements DocumentEvent, TextUploadEvent
{
    public function __construct(
        public string $uploadId,
    ) {}
}
