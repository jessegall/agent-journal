<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\QueuePart;
use App\Pipes\Supervision\NotifySpawnRefused;
use App\Pipes\Supervision\SpawnPart;
use App\Support\Execution\PendingPart;
use App\Support\Execution\SpawnedPart;
use App\Support\Execution\SpawnRefused;
use App\Support\Execution\StepOutcome;
use App\Support\Step;

/**
 * Runs a program as one part of a step: queued, started, its output read and its end recorded, or ended as not found
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
            Step::chosen(
                fn (SpawnedPart|SpawnRefused $attempt) => $attempt instanceof SpawnedPart,
                FinishSpawnedPartPipeline::class,
                NotifySpawnRefused::class,
            ),
        ];
    }
}
