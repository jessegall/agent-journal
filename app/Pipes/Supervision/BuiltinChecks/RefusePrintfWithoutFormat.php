<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\BuiltinChecks;

use App\Contracts\Bus\Pipe;
use App\Enums\BuiltinCommand;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\PlannedRun;

/**
 * Refuses a printf without a format before anything runs.
 */
final readonly class RefusePrintfWithoutFormat implements Pipe
{
    public function handle(PlannedRun $run): PlannedRun
    {
        foreach ($run->callsOf(BuiltinCommand::Printf) as $words) {
            if (count($words) < 2) {
                throw SupervisorRefused::unsupportedBuiltin('printf', 'it needs a format');
            }
        }

        return $run;
    }
}
