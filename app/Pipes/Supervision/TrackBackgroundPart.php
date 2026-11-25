<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Enums\Runs\ExitStatus;
use App\Support\Execution\SpawnedPart;
use App\Support\Execution\StepOutcome;

/**
 * A started background part is waited for when the run ends; its step succeeds at once.
 */
final readonly class TrackBackgroundPart implements Pipe
{
    public function handle(SpawnedPart $part): StepOutcome
    {
        $part->queued->state->track($part);

        return new StepOutcome(ExitStatus::Success->status(), $part->queued->context);
    }
}
