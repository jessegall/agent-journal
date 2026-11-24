<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Enums\ExitStatus;
use App\Support\Execution\QueuedPart;
use App\Support\Execution\StepOutcome;

/**
 * A part whose admission went stale while the run was going is skipped, never run, and its step ends as a command
 * the shell could not find.
 */
final readonly class SkipStalePart implements Pipe
{
    public function handle(QueuedPart $queued): StepOutcome
    {
        $queued->state->events->skipped($queued->part, $queued->staleReason());

        return new StepOutcome(ExitStatus::CommandNotFound->status(), $queued->context);
    }
}
