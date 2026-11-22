<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Run\NameAdmission;

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
