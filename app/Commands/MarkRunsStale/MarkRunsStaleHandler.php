<?php

declare(strict_types=1);

namespace App\Commands\MarkRunsStale;

use App\Contracts\Bus\CommandHandler;
use App\Models\ProcessRun;

final readonly class MarkRunsStaleHandler implements CommandHandler
{
    public function handle(MarkRunsStaleCommand $command): int
    {
        $runs = ProcessRun::query()->acrossActors()->unfinishedIn($command->projectKey)->readLimit(1_000)->get();

        foreach ($runs as $run) {
            $run->markStale($command->reason);
        }

        return $runs->count();
    }
}
