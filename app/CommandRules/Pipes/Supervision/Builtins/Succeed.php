<?php

declare(strict_types=1);

namespace App\CommandRules\Pipes\Supervision\Builtins;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Execution\BuiltinCall;
use App\CommandRules\Execution\BuiltinEnded;
use App\Processes\Enums\ExitStatus;

/**
 * true and the colon: succeed and change nothing.
 */
final readonly class Succeed implements Pipe
{
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        return $call->ended(ExitStatus::Success->status(), $call->context());
    }
}
