<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\PartRunEvent;

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
