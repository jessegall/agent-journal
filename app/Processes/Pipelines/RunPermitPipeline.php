<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Run\StartPermitRun;

/**
 * Starts and runs the evidence run a permit allows.
 */
final readonly class RunPermitPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            StartPermitRun::class,
            RunAdmissionPipeline::class,
        ];
    }
}
