<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Processes\Enums\ExitStatus;
use App\Processes\Execution\SpawnedPart;
use App\Support\Execution\StepOutcome;

/**
 * A started background part is waited for when the run ends; its step succeeds at once.
 */
final readonly class TrackBackgroundPart implements Pipe
{
    public function handle(SpawnedPart $part): StepOutcome
    {
        $part->runInBackground();

        return new StepOutcome(ExitStatus::Success->status(), $part->context());
    }
}
