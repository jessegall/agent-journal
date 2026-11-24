<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\BuiltinChecks;

use App\Contracts\Bus\Pipe;
use App\Enums\BuiltinCommand;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\RunToSupervise;

/**
 * Refuses a cd given more than one folder before anything runs.
 */
final readonly class RefuseCdWithSeveralFolders implements Pipe
{
    public function handle(RunToSupervise $run): RunToSupervise
    {
        foreach ($run->callsOf(BuiltinCommand::ChangeFolder) as $words) {
            if (count($words) > 2) {
                throw SupervisorRefused::unsupportedBuiltin('cd', 'it takes one folder');
            }
        }

        return $run;
    }
}
