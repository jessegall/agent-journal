<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Execution\BuiltinEnded;
use App\Processes\Enums\OutputStream;
use App\Support\Execution\StepOutcome;
use App\Values\PartEnd;

/**
 * Records what a builtin printed and how it ended, and gives its step the builtin's status, context and output.
 */
final readonly class EndBuiltin implements Pipe
{
    public function handle(BuiltinEnded $ended): StepOutcome
    {
        $queued = $ended->call->queued;
        $events = $queued->state->events;
        $printed = [OutputStream::Stdout->value => $ended->stdout, OutputStream::Stderr->value => $ended->stderr];

        foreach (array_filter($printed) as $stream => $bytes) {
            $events->output($queued->part, OutputStream::from($stream), $bytes);
        }

        $events->ended($queued->part, PartEnd::exited($ended->status->code), true);

        return new StepOutcome($ended->status, $ended->context, $ended->stdout);
    }
}
