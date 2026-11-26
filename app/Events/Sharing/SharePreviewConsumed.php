<?php

declare(strict_types=1);

namespace App\Events\Sharing;

/**
 * A share preview was used once by its owner to grant what it showed.
 */
final readonly class SharePreviewConsumed implements ShareEvent
{
    public function __construct(
        public string $previewId,
    ) {}
}
