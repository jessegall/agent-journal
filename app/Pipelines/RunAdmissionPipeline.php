<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Pipes\Run\FetchAdmission;
use App\Pipes\Run\NotifyAlreadyStarted;
use App\Support\Run\FetchedAdmission;
use App\Support\Run\PendingAdmission;
use App\Values\CommandReport;

/**
 * Fetches an admitted run once and runs it, unless it started before.
 *
 * @implements PipelineDefinition<PendingAdmission, CommandReport>
 */
final readonly class RunAdmissionPipeline implements PipelineDefinition
{
    public string $input = PendingAdmission::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            FetchAdmission::class,
            Step::conditional(
                fn (FetchedAdmission $admission) => $admission->isAlreadyStarted(),
                then: NotifyAlreadyStarted::class,
                else: RunAdmittedLinePipeline::class,
            ),
        ];
    }
}
