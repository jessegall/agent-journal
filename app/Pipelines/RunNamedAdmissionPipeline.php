<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Run\NameAdmission;
use App\Support\Run\RunStart;
use App\Values\CommandReport;

/**
 * Runs the admission the command was named.
 *
 * @implements PipelineDefinition<RunStart, CommandReport>
 */
final readonly class RunNamedAdmissionPipeline implements PipelineDefinition
{
    public string $input = RunStart::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            NameAdmission::class,
            RunAdmissionPipeline::class,
        ];
    }
}
