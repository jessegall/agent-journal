<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\StepType;
use App\Processes\Exceptions\SupervisorRefused;
use App\Processes\Execution\QueuedPart;
use App\Support\Execution\PendingStep;
use App\Support\Execution\PipedCommands;

/**
 * Queues each command of a shell pipeline: the first reads nothing, each later one the command before it. A pipeline
 * of anything but plain commands is refused.
 */
final readonly class QueuePipedCommands implements Pipe
{
    private const array FROM_THE_COMMAND_BEFORE = [
        'pipe',
        'r',
    ];

    public function handle(PendingStep $toRun): PipedCommands
    {
        $waiting = [];

        foreach ($toRun->step->children as $index => $command) {
            if ($command->type !== StepType::Command || $command->children !== []) {
                throw SupervisorRefused::stepNotRun($command->type);
            }

            $input = $index > 0 ? self::FROM_THE_COMMAND_BEFORE : QueuedPart::NO_INPUT;
            $part = $toRun->state->queue($command);
            $waiting[] = new QueuedPart($command, $part, $toRun->context, $toRun->state, [], $input);
        }

        return new PipedCommands($toRun, $waiting);
    }
}
