<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ProcessRunEvent;

/**
 * A process run took the next number for an update its host reports.
 */
final readonly class ProcessRunUpdateCounted implements ProcessEvent, ProcessRunEvent
{
    public function __construct(public string $runId, public int $sequence) {}
}
