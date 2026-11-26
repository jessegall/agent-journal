<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\ProcessRunEvent;

/**
 * A host took a process run's start, so the run is running.
 */
final readonly class ProcessRunConsumed implements ProcessEvent, ProcessRunEvent
{
    public function __construct(public string $runId) {}
}
