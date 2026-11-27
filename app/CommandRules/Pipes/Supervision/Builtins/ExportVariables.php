<?php

declare(strict_types=1);

namespace App\CommandRules\Pipes\Supervision\Builtins;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Execution\BuiltinCall;
use App\CommandRules\Execution\BuiltinEnded;
use App\Processes\Enums\ExitStatus;

/**
 * export: sets each NAME=value it is given in the variables the later parts start with; a bare name changes nothing.
 */
final readonly class ExportVariables implements Pipe
{
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        $assignments = [];

        foreach ($call->arguments as $argument) {
            if (! str_contains($argument, '=')) {
                continue;
            }

            [$name, $assigned] = explode('=', $argument, 2);
            $assignments[$name] = $assigned;
        }

        $context = $call->context();

        return $call->ended(
            ExitStatus::Success->status(),
            $context->withEnvironment([...$context->environment, ...$assignments]),
        );
    }
}
