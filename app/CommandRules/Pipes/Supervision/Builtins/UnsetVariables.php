<?php

declare(strict_types=1);

namespace App\CommandRules\Pipes\Supervision\Builtins;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Execution\BuiltinCall;
use App\CommandRules\Execution\BuiltinEnded;
use App\Processes\Enums\ExitStatus;

/**
 * unset: removes each named variable from those the later parts start with.
 */
final readonly class UnsetVariables implements Pipe
{
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        $context = $call->context();

        return $call->ended(
            ExitStatus::Success->status(),
            $context->withEnvironment(array_diff_key($context->environment, array_flip($call->arguments))),
        );
    }
}
