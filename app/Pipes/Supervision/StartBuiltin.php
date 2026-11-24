<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Enums\BuiltinCommand;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\QueuedPart;

/**
 * Starts a builtin inside the supervisor itself: recorded as started on this machine, with its name and arguments.
 */
final readonly class StartBuiltin implements Pipe
{
    public function handle(QueuedPart $queued): BuiltinCall
    {
        [$name, $arguments] = [$queued->argv()[0], array_slice($queued->argv(), 1)];
        $command = BuiltinCommand::tryFrom($name)
            ?? throw SupervisorRefused::unsupportedBuiltin($name, 'it has no adapter');
        $queued->state->events->startedInside($queued->part, gethostname() ?: 'unknown');

        return new BuiltinCall($queued, $command, $arguments);
    }
}
