<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\PipelineDefinition;
use App\Pipes\Run\CheckPlanDigest;
use App\Pipes\Run\ReportPartResults;
use App\Pipes\Run\SuperviseRun;

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
