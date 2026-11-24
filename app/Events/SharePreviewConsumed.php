<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A share preview was used once by its owner to grant what it showed.
 */
final readonly class SharePreviewConsumed extends ShareEvent
{
    public function __construct(
        public string $previewId,
    ) {}
}
