<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\BuiltinChecks;

use App\Contracts\Bus\Pipe;
use App\Enums\BuiltinCommand;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\RunToSupervise;

/**
 * Refuses a printf without a format before anything runs.
 */
final readonly class RefusePrintfWithoutFormat implements Pipe
{
    public function handle(RunToSupervise $run): RunToSupervise
    {
        foreach ($run->callsOf(BuiltinCommand::Printf) as $words) {
            if (count($words) < 2) {
                throw SupervisorRefused::unsupportedBuiltin('printf', 'it needs a format');
            }
        }

        return $run;
    }
}
