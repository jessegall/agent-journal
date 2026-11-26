<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\ProcessRunEvent;

/**
 * A process run's process was lost, so how it ended is unknown.
 */
final readonly class ProcessRunLost implements ProcessEvent, ProcessRunEvent
{
    public function __construct(public string $runId) {}
}
