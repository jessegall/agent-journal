<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\PipelineDefinition;
use App\Pipes\Run\AdmitLine;

/**
 * Admits a direct line through the one shell admission and runs it; a refusal stops it before anything starts.
 */
final readonly class RunLinePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            AdmitLine::class,
            RunAdmissionPipeline::class,
        ];
    }
}
