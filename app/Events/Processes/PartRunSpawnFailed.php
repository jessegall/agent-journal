<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\PartRunEvent;

/**
 * A part of a run could not start its process.
 */
final readonly class PartRunSpawnFailed implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
        public string $reason,
    ) {}
}
