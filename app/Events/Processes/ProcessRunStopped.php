<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ProcessRunEvent;

/**
 * A process run was stopped before it ended, for the reason given.
 */
final readonly class ProcessRunStopped implements ProcessEvent, ProcessRunEvent
{
    public function __construct(public string $runId, public string $reason) {}
}
