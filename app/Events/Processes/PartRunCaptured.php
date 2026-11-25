<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run captured its output up to a chunk.
 */
final readonly class PartRunCaptured implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
    ) {}
}
