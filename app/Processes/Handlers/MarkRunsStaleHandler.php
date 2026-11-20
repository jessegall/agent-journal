<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\MarkRunsStale;
use App\Processes\Models\ProcessRun;

final readonly class MarkRunsStaleHandler implements CommandHandler
{
    public function handle(MarkRunsStale $command): int
    {
        $runs = ProcessRun::query()->acrossActors()->unfinishedIn($command->projectKey)->readLimit(1_000)->get();

        foreach ($runs as $run) {
            $run->markStale($command->reason);
        }

        return $runs->count();
    }
}
