<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\NotifyAnswer;
use App\Pipes\SendCall;
use App\Values\CommandReport;
use App\Values\PendingCall;

/**
 * Runs one signed call for a console command: sends it and reports its answer.
 *
 * @implements PipelineDefinition<PendingCall, CommandReport>
 */
final readonly class RunSignedCallPipeline implements PipelineDefinition
{
    public string $input = PendingCall::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            SendCall::class,
            NotifyAnswer::class,
        ];
    }
}
