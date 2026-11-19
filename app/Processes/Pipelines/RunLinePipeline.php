<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Run\AdmitLine;
use App\Processes\Pipes\Run\ReportRefusedLine;
use App\Processes\Values\Run\LineAdmission;

/**
 * Admits a direct line through the one shell admission and runs it; a refusal reports why and starts nothing.
 */
final readonly class RunLinePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            AdmitLine::class,
            Step::chosen(
                fn (LineAdmission $admission) => $admission->isAllowed(),
                then: RunAllowedLinePipeline::class,
                else: ReportRefusedLine::class,
            ),
        ];
    }
}
