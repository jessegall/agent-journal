<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\CleanOutputPayload;
use App\Api\Processes\OutputCleaned;
use App\Attributes\Bus\Dispatches;
use App\Commands\Runs\CleanProcessOutput\CleanProcessOutputCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Cleans the named runs' output and answers what it removed.
 */
final readonly class CleanOutputController
{
    #[Dispatches(CleanProcessOutputCommand::class)]
    public function __invoke(CleanOutputPayload $call, CommandBus $commands): OutputCleaned
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
