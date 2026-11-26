<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\PartRunEvent;

/**
 * A part of a run started on its host.
 */
final readonly class PartRunStarted implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
        public string $host,
    ) {}
}
