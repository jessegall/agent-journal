<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Pipes\Supervision\DrainPart;
use App\Pipes\Supervision\FinishPart;
use App\Pipes\Supervision\NotifySpawnRefused;
use App\Pipes\Supervision\QueuePart;
use App\Pipes\Supervision\SpawnPart;
use App\Processes\Execution\SpawnedPart;
use App\Processes\Execution\SpawnRefused;
use App\Support\Execution\PendingPart;
use App\Support\Execution\StepOutcome;

/**
 * Runs a command as one part of a step: queued, started, its output read and its end recorded, or ended as not found
 * when it did not start.
 *
 * @implements PipelineDefinition<PendingPart, StepOutcome>
 */
final readonly class RunExternalPartPipeline implements PipelineDefinition
{
    public string $input = PendingPart::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            QueuePart::class,
            SpawnPart::class,
            Step::conditional(
                fn (SpawnedPart|SpawnRefused $attempt) => $attempt instanceof SpawnedPart,
                then: [DrainPart::class, FinishPart::class],
                else: NotifySpawnRefused::class,
            ),
        ];
    }
}
