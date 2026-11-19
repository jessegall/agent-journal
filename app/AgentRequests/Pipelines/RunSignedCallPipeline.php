<?php

declare(strict_types=1);

namespace App\AgentRequests\Pipelines;

use App\AgentRequests\Pipes\ReportAnswer;
use App\AgentRequests\Pipes\SendCall;
use App\Pipelines\Contracts\PipelineDefinition;

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
