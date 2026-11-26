<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\BuiltinChecks;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\BuiltinCommand;
use App\Processes\Exceptions\SupervisorRefused;
use App\Support\Execution\PlannedRun;

/**
 * Refuses a printf whose format holds a conversion other than %s, %d and %% before anything runs.
 */
final readonly class RefusePrintfConversions implements Pipe
{
    private const string UNRUN_CONVERSION = '/%(?![sd%])/';

    public function handle(PlannedRun $run): PlannedRun
    {
        foreach ($run->callsOf(BuiltinCommand::Printf) as $words) {
            if (preg_match(self::UNRUN_CONVERSION, $words[1]) === 1) {
                throw SupervisorRefused::unsupportedBuiltin('printf', 'only %s, %d and %% are run');
            }
        }

        return $run;
    }
}
