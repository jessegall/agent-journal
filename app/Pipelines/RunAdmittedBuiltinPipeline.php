<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\EndBuiltin;
use App\Pipes\Supervision\StartBuiltin;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\QueuedPart;
use App\Support\Execution\StepOutcome;
use App\Support\Step;

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
