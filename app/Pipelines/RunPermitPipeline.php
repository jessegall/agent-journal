<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Run\StartPermitRun;

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
