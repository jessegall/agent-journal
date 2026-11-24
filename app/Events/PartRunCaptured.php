<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run captured its output up to a chunk.
 */
final readonly class PartRunCaptured extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
    ) {}
}
