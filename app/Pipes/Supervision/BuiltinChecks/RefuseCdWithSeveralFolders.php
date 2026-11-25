<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\BuiltinChecks;

use App\Contracts\Bus\Pipe;
use App\Enums\CommandRules\BuiltinCommand;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\PlannedRun;

/**
 * Refuses a cd given more than one folder before anything runs.
 */
final readonly class RefuseCdWithSeveralFolders implements Pipe
{
    public function handle(PlannedRun $run): PlannedRun
    {
        foreach ($run->callsOf(BuiltinCommand::ChangeFolder) as $words) {
            if (count($words) > 2) {
                throw SupervisorRefused::unsupportedBuiltin('cd', 'it takes one folder');
            }
        }

        return $run;
    }
}
