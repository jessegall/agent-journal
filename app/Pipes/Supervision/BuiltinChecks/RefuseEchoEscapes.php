<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\BuiltinChecks;

use App\Contracts\Bus\Pipe;
use App\Enums\BuiltinCommand;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\PlannedRun;

/**
 * Refuses an echo with -e or -E before anything runs: only -n is run.
 */
final readonly class RefuseEchoEscapes implements Pipe
{
    private const array ESCAPE_FLAGS = ['-e', '-E'];

    public function handle(PlannedRun $run): PlannedRun
    {
        foreach ($run->callsOf(BuiltinCommand::Echo) as $words) {
            if (array_intersect(array_slice($words, 1), self::ESCAPE_FLAGS) !== []) {
                throw SupervisorRefused::unsupportedBuiltin('echo', 'only -n is run');
            }
        }

        return $run;
    }
}
