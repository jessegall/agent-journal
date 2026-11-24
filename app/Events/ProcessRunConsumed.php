<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\ProcessRunEvent;

/**
 * A host took a process run's start, so the run is running.
 */
final readonly class ProcessRunConsumed extends ProcessEvent implements ProcessRunEvent
{
    public function __construct(public string $runId) {}
}
