<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Run\StartPermitRun;
use App\Support\Run\RunStart;
use App\Values\CommandReport;

/**
 * Starts and runs the evidence run a permit allows.
 *
 * @implements PipelineDefinition<RunStart, CommandReport>
 */
final readonly class RunPermitPipeline implements PipelineDefinition
{
    public string $input = RunStart::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            StartPermitRun::class,
            RunAdmissionPipeline::class,
        ];
    }
}
