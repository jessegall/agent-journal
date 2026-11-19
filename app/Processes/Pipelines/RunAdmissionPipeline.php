<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Run\FetchAdmission;
use App\Processes\Pipes\Run\ReportAlreadyStarted;
use App\Processes\Values\Run\FetchedAdmission;

/**
 * Fetches an admitted run once and runs it, unless it started before.
 */
final readonly class RunAdmissionPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            FetchAdmission::class,
            Step::chosen(
                fn (FetchedAdmission $admission) => $admission->alreadyStarted(),
                then: ReportAlreadyStarted::class,
                else: RunAdmittedLinePipeline::class,
            ),
        ];
    }
}
