<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Run\NameAdmission;

/**
 * Runs the admission the command was named.
 */
final readonly class RunNamedAdmissionPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            NameAdmission::class,
            RunAdmissionPipeline::class,
        ];
    }
}
