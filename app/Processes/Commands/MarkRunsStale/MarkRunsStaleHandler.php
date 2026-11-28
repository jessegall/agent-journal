<?php

declare(strict_types=1);

namespace App\Processes\Commands\MarkRunsStale;

use App\Bus\Contracts\CommandHandler;
use App\Models\Runs\ProcessRun;

final readonly class MarkRunsStaleHandler implements CommandHandler
{
    public function handle(MarkRunsStaleCommand $command): int
    {
        $runs = ProcessRun::query()
            ->acrossActors()
            ->inProject($command->projectId)
            ->unfinished()
            ->limit(1_000)
            ->get();

        foreach ($runs as $run) {
            $run->markStale($command->reason);
        }

        return $runs->count();
    }
}
