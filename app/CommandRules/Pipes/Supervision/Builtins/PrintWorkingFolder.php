<?php

declare(strict_types=1);

namespace App\CommandRules\Pipes\Supervision\Builtins;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Execution\BuiltinCall;
use App\CommandRules\Execution\BuiltinEnded;
use App\Processes\Enums\ExitStatus;

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
