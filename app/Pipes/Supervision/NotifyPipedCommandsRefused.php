<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Processes\Enums\ExitStatus;
use App\Support\Execution\PipedCommands;
use App\Support\Execution\StepOutcome;

/**
 * A pipeline one of whose commands did not start ends as a command the shell could not find.
 */
final readonly class NotifyPipedCommandsRefused implements Pipe
{
    public function handle(PipedCommands $commands): StepOutcome
    {
        return new StepOutcome(ExitStatus::CommandNotFound->status(), $commands->toRun->context);
    }
}
