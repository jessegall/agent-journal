<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Enums\ExitStatus;
use App\Support\Execution\SpawnRefused;
use App\Support\Execution\StepOutcome;

/**
 * A part that did not start ends its step as a command the shell could not find.
 */
final readonly class ReportSpawnRefused implements Pipe
{
    public function handle(SpawnRefused $refused): StepOutcome
    {
        return new StepOutcome(ExitStatus::CommandNotFound->status(), $refused->queued->context);
    }
}
