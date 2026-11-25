<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use Domain\Documents\Contracts\TextUploadEvent;

/**
 * A text upload was used as the body of a document or report.
 */
final readonly class TextUploadConsumed implements DocumentEvent, TextUploadEvent
{
    public function __construct(
        public string $uploadId,
    ) {}
}
