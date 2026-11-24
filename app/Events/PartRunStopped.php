<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run was stopped for the reason given.
 */
final readonly class PartRunStopped extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
        public string $reason,
    ) {}
}
