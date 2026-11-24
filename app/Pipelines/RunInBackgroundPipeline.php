<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\LeaveRefusedBackground;
use App\Pipes\Supervision\QueuePart;
use App\Pipes\Supervision\SpawnPart;
use App\Pipes\Supervision\TakeBackgroundCommand;
use App\Pipes\Supervision\TrackBackgroundPart;
use App\Support\Execution\SpawnedPart;
use App\Support\Execution\SpawnRefused;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\PendingStep;
use App\Support\Step;

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
            Step::chosen(
                fn (SpawnedPart|SpawnRefused $attempt) => $attempt instanceof SpawnedPart,
                TrackBackgroundPart::class,
                LeaveRefusedBackground::class,
            ),
        ];
    }
}
