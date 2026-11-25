<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\Builtins;

use App\Contracts\Bus\Pipe;
use App\Enums\Runs\ExitStatus;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\BuiltinEnded;

/**
 * false: fails and changes nothing.
 */
final readonly class Fail implements Pipe
{
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        return $call->ended(ExitStatus::Failure->status(), $call->context());
    }
}
