<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Processes\Enums\ExitStatus;
use App\Processes\Execution\QueuedPart;
use App\Support\Execution\StepOutcome;

/**
 * A part whose admission went stale while the run was going is skipped, never run, and its step ends as a command
 * the shell could not find.
 */
final readonly class SkipStalePart implements Pipe
{
    public function handle(QueuedPart $queued): StepOutcome
    {
        $queued->skipAsStale();

        return new StepOutcome(ExitStatus::CommandNotFound->status(), $queued->context);
    }
}
