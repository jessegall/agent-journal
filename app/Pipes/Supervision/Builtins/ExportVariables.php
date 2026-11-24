<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\Builtins;

use App\Contracts\Bus\Pipe;
use App\Enums\ExitStatus;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\BuiltinEnded;

/**
 * export: sets each NAME=value it is given in the variables the later parts start with; a bare name changes nothing.
 */
final readonly class ExportVariables implements Pipe
{
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        $assignments = [];

        foreach ($call->arguments as $argument) {
            if (str_contains($argument, '=')) {
                [$name, $assigned] = explode('=', $argument, 2);
                $assignments[$name] = $assigned;
            }
        }

        $context = $call->context();

        return $call->ended(
            ExitStatus::Success->status(),
            $context->withEnvironment([...$context->environment, ...$assignments]),
        );
    }
}
