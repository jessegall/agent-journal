<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\Builtins;

use App\Contracts\Bus\Pipe;
use App\Enums\Runs\ExitStatus;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\BuiltinEnded;

/**
 * pwd: prints the folder the run is in.
 */
final readonly class PrintWorkingFolder implements Pipe
{
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        return $call->ended(ExitStatus::Success->status(), $call->context(), $call->context()->workingFolder."\n");
    }
}
