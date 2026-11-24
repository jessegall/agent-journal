<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Run\AdmitLine;
use App\Support\Run\RunStart;
use App\Values\CommandReport;

/**
 * Admits a direct line through the one shell admission and runs it; a refusal stops it before anything starts.
 *
 * @implements PipelineDefinition<RunStart, CommandReport>
 */
final readonly class RunLinePipeline implements PipelineDefinition
{
    public string $input = RunStart::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            AdmitLine::class,
            RunAdmissionPipeline::class,
        ];
    }
}
