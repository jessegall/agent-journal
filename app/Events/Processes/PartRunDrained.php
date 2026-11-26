<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\PartRunEvent;

/**
 * A part of a run finished draining its output.
 */
final readonly class PartRunDrained implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
    ) {}
}
