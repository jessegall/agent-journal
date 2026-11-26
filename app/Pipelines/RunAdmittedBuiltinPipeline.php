<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\CommandRules\Execution\BuiltinCall;
use App\Pipelines\Support\Step;
use App\Pipes\Supervision\EndBuiltin;
use App\Pipes\Supervision\StartBuiltin;
use App\Processes\Execution\QueuedPart;
use App\Support\Execution\StepOutcome;

/**
 * Starts a builtin, runs the pipe of that builtin, and records how it ended.
 *
 * @implements PipelineDefinition<QueuedPart, StepOutcome>
 */
final readonly class RunAdmittedBuiltinPipeline implements PipelineDefinition
{
    public string $input = QueuedPart::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            StartBuiltin::class,
            Step::resolvedBy(fn (BuiltinCall $call) => $call->command->pipe()),
            EndBuiltin::class,
        ];
    }
}
