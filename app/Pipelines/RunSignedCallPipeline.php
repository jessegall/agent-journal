<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\NotifyAnswer;
use App\Pipes\SendPayload;
use App\Values\CommandReport;
use App\Values\PendingPayload;

/**
 * Runs one signed call for a console command: sends it and reports its answer.
 *
 * @implements PipelineDefinition<PendingPayload, CommandReport>
 */
final readonly class RunSignedCallPipeline implements PipelineDefinition
{
    public string $input = PendingPayload::class;

    public string $output = CommandReport::class;

    public function pipes(): array
    {
        return [
            SendPayload::class,
            NotifyAnswer::class,
        ];
    }
}
