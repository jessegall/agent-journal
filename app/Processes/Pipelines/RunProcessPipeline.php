<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Values\Run\RunStart;

/**
 * Runs what process:run was asked: a line to admit, a permit, or a named admission.
 */
final readonly class RunProcessPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            Step::resolvedBy(fn (RunStart $start) => $start->entryPipeline()),
        ];
    }
}
