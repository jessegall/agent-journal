<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Processes\Enums\ExitStatus;
use App\Processes\Execution\SpawnRefused;
use App\Support\Execution\StepOutcome;

/**
 * A background part that did not start is left as recorded; its step succeeds, as the shell's does.
 */
final readonly class LeaveRefusedBackground implements Pipe
{
    public function handle(SpawnRefused $refused): StepOutcome
    {
        return new StepOutcome(ExitStatus::Success->status(), $refused->queued->context);
    }
}
