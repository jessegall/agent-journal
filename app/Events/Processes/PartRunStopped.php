<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run was stopped for the reason given.
 */
final readonly class PartRunStopped implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
        public string $reason,
    ) {}
}
