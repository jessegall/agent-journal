<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\CommandRules\Execution\BuiltinCall;
use App\Pipelines\Support\Step;
use App\Pipes\Supervision\EndBuiltin;
use App\Pipes\Supervision\QueuePart;
use App\Pipes\Supervision\SkipStalePart;
use App\Pipes\Supervision\StartBuiltin;
use App\Processes\Execution\QueuedPart;
use App\Support\Execution\PendingPart;
use App\Support\Execution\StepOutcome;

/**
 * Runs a builtin as one part of a step, inside the supervisor; a part whose admission went stale is skipped.
 *
 * @implements PipelineDefinition<PendingPart, StepOutcome>
 */
final readonly class RunBuiltinPipeline implements PipelineDefinition
{
    public string $input = PendingPart::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            QueuePart::class,
            Step::conditional(
                fn (QueuedPart $queued) => $queued->isStale(),
                then: SkipStalePart::class,
                else: [
                    StartBuiltin::class,
                    Step::resolvedBy(fn (BuiltinCall $call) => $call->command->pipe()),
                    EndBuiltin::class,
                ],
            ),
        ];
    }
}
