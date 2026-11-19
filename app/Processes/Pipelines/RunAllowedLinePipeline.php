<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Run\TakeAdmittedRun;

/**
 * Runs the run the journal admitted for a line.
 */
final readonly class RunAllowedLinePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            TakeAdmittedRun::class,
            RunAdmissionPipeline::class,
        ];
    }
}
