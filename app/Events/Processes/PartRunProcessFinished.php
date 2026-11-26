<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\PartRunEvent;

/**
 * A part of a run's process ended.
 */
final readonly class PartRunProcessFinished implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
    ) {}
}
