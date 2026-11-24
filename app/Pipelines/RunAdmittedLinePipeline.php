<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Run\CheckPlanDigest;
use App\Pipes\Run\NotifyPartResults;
use App\Pipes\Run\OpenRunChannel;
use App\Pipes\Run\NotifyRunEnd;
use App\Pipes\Run\SuperviseRun;
use App\Support\Run\FetchedAdmission;
use App\Values\CommandReport;

/**
 * Checks the plan against the admitted tree, runs it and reports its output and each part's result.
 *
 * @implements PipelineDefinition<FetchedAdmission, CommandReport>
 */
final readonly class RunAdmittedLinePipeline implements PipelineDefinition
{
    public string $input = FetchedAdmission::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            CheckPlanDigest::class,
            OpenRunChannel::class,
            SuperviseRun::class,
            NotifyRunEnd::class,
            NotifyPartResults::class,
        ];
    }
}
