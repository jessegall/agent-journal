<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\ReportAnswer;
use App\Pipes\SendCall;
use App\Values\CallToSend;
use App\Values\CommandReport;

/**
 * Runs one signed call for a console command: sends it and reports its answer.
 *
 * @implements PipelineDefinition<CallToSend, CommandReport>
 */
final readonly class RunSignedCallPipeline implements PipelineDefinition
{
    public string $input = CallToSend::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            SendCall::class,
            ReportAnswer::class,
        ];
    }
}
