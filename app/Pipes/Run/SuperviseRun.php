<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Pipelines\SuperviseRunPipeline;
use App\Pipelines\Support\PipelineAdapter;
use App\Support\Execution\PlannedRun;
use App\Support\Execution\StepOutcome;
use App\Support\Run\ChannelRunEnded;
use App\Support\Run\RunChannel;

/**
 * Runs the admitted plan under the supervisor, its events going over the run's channel.
 *
 * @extends PipelineAdapter<RunChannel, StepOutcome>
 */
final readonly class SuperviseRun extends PipelineAdapter
{
    protected function definition(): string
    {
        return SuperviseRunPipeline::class;
    }

    protected function produces(): string
    {
        return StepOutcome::class;
    }

    protected function into(object $input): PlannedRun
    {
        return $input->toSupervise();
    }

    protected function back(object $outcome, object $input): ChannelRunEnded
    {
        return $input->ended($outcome);
    }
}
