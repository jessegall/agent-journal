<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ProcessRunEvent;

/**
 * A process run no longer tells a user how it ended.
 */
final readonly class ProcessRunOutcomeUserRevoked implements ProcessEvent, ProcessRunEvent
{
    public function __construct(public string $runId) {}
}
