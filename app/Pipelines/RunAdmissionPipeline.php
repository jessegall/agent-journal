<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\PipelineDefinition;
use App\Pipes\Run\FetchAdmission;
use App\Pipes\Run\ReportAlreadyStarted;
use App\Support\Run\FetchedAdmission;
use App\Support\Step;

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
