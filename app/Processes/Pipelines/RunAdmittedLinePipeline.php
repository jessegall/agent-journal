<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Run\CheckPlanDigest;
use App\Processes\Pipes\Run\ReportPartResults;
use App\Processes\Pipes\Run\SuperviseRun;

/**
 * Checks the plan against the admitted tree, runs it and reports its output and each part's result.
 */
final readonly class RunAdmittedLinePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            CheckPlanDigest::class,
            SuperviseRun::class,
            ReportPartResults::class,
        ];
    }
}
