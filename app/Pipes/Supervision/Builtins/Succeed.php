<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\Builtins;

use App\Contracts\Bus\Pipe;
use App\Enums\Runs\ExitStatus;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\BuiltinEnded;

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
