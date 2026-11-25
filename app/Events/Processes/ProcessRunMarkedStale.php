<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ProcessRunEvent;

/**
 * A process run no longer matches what it was started for, for the reason given.
 */
final readonly class ProcessRunMarkedStale implements ProcessEvent, ProcessRunEvent
{
    public function __construct(public string $runId, public string $reason) {}
}
