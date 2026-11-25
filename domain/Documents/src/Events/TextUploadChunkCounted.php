<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use Domain\Documents\Contracts\TextUploadEvent;

/**
 * A text upload received one more chunk.
 */
final readonly class TextUploadChunkCounted implements DocumentEvent, TextUploadEvent
{
    public function __construct(
        public string $uploadId,
    ) {}
}
