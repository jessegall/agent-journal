<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run's process ended.
 */
final readonly class PartRunProcessFinished extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
    ) {}
}
