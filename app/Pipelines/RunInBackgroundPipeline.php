<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Pipes\Supervision\LeaveRefusedBackground;
use App\Pipes\Supervision\QueuePart;
use App\Pipes\Supervision\SpawnPart;
use App\Pipes\Supervision\TakeBackgroundCommand;
use App\Pipes\Supervision\TrackBackgroundPart;
use App\Processes\Execution\SpawnedPart;
use App\Processes\Execution\SpawnRefused;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepOutcome;

/**
 * Starts a background step's command and goes on at once; the run waits for it when it ends.
 *
 * @implements PipelineDefinition<PendingStep, StepOutcome>
 */
final readonly class RunInBackgroundPipeline implements PipelineDefinition
{
    public string $input = PendingStep::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            TakeBackgroundCommand::class,
            QueuePart::class,
            SpawnPart::class,
            Step::conditional(
                fn (SpawnedPart|SpawnRefused $attempt) => $attempt instanceof SpawnedPart,
                then: TrackBackgroundPart::class,
                else: LeaveRefusedBackground::class,
            ),
        ];
    }
}
