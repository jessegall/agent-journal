<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Support\Run\RunStart;
use App\Support\Step;
use App\Values\CommandReport;

/**
 * Runs what process:run was asked: a line to admit, a permit, or a named admission.
 *
 * @implements PipelineDefinition<RunStart, CommandReport>
 */
final readonly class RunProcessPipeline implements PipelineDefinition
{
    public string $input = RunStart::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            Step::resolvedBy(fn (RunStart $start) => $start->entryPipeline()),
        ];
    }
}
