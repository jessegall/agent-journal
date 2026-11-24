<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Run\FetchAdmission;
use App\Pipes\Run\NotifyAlreadyStarted;
use App\Support\Run\AdmissionToRun;
use App\Support\Run\FetchedAdmission;
use App\Support\Step;
use App\Values\CommandReport;

/**
 * Fetches an admitted run once and runs it, unless it started before.
 *
 * @implements PipelineDefinition<AdmissionToRun, CommandReport>
 */
final readonly class RunAdmissionPipeline implements PipelineDefinition
{
    public string $input = AdmissionToRun::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            FetchAdmission::class,
            Step::chosen(
                fn (FetchedAdmission $admission) => $admission->alreadyStarted(),
                then: NotifyAlreadyStarted::class,
                else: RunAdmittedLinePipeline::class,
            ),
        ];
    }
}
