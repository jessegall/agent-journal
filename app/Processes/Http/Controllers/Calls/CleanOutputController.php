<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\CleanOutputCall;
use App\Processes\Calls\OutputCleaned;
use App\Processes\Commands\CleanProcessOutput\CleanProcessOutputCommand;

/**
 * Cleans the named runs' output and answers what it removed.
 */
final readonly class CleanOutputController
{
    public function __invoke(CleanOutputCall $call, CommandBus $commands): OutputCleaned
    {
        $preview = $commands->run(new CleanProcessOutputCommand($call->runs, $call->preview));

        return OutputCleaned::from([
            'runs' => $preview->runIds,
            'parts' => $preview->partRunIds,
            'bytes' => $preview->bytes,
            'removed' => $preview->removed,
        ]);
    }
}
