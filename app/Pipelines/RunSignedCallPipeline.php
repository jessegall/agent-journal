<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\ReportAnswer;
use App\Pipes\SendCall;

/**
 * Runs one signed call for a console command: sends it and reports its answer.
 */
final readonly class RunSignedCallPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            SendCall::class,
            ReportAnswer::class,
        ];
    }
}
