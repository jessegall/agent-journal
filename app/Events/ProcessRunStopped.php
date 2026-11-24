<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\ProcessRunEvent;

/**
 * A process run was stopped before it ended, for the reason given.
 */
final readonly class ProcessRunStopped extends ProcessEvent implements ProcessRunEvent
{
    public function __construct(public string $runId, public string $reason) {}
}
