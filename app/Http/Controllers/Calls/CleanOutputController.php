<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\CleanOutputCall;
use App\Calls\Processes\OutputCleaned;
use App\Commands\Runs\CleanProcessOutput\CleanProcessOutputCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Cleans the named runs' output and answers what it removed.
 */
final readonly class CleanOutputController
{
    public function __invoke(CleanOutputCall $call, CommandBus $commands): OutputCleaned
    {
        $preview = $commands->run(new CleanProcessOutputCommand($call->runs, $call->isPreview));

        return OutputCleaned::from([
            'runs' => $preview->runIds,
            'parts' => $preview->partRunIds,
            'bytes' => $preview->bytes,
            'isRemoved' => $preview->isRemoved,
        ]);
    }
}
