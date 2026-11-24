<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\SpawnablePart;
use App\Support\Execution\SpawnedPart;
use App\Support\Execution\SpawnedProcess;

/**
 * Starts the next part to spawn after its intent is stored: a single part, or the next command of a pipeline. A part
 * whose admission went stale is skipped, and one that cannot start is recorded as failed to spawn; either is refused
 * with its reason.
 */
final readonly class SpawnPart implements Pipe
{
    public function handle(SpawnablePart $toSpawn): object
    {
        $queued = $toSpawn->nextSpawnable();
        $events = $queued->state->events;

        if ($queued->isStale()) {
            $events->skipped($queued->part, $queued->staleReason());

            return $toSpawn->refused($queued->staleReason());
        }

        $process = SpawnedProcess::start(
            $queued->argv(),
            $queued->descriptors(),
            $queued->context->workingFolder,
            $queued->environment(),
        );

        if (is_string($process)) {
            $events->spawnFailed($queued->part, $process);

            return $toSpawn->refused($process);
        }

        $events->started($queued->part, $process->pid, gethostname() ?: 'unknown');

        return $toSpawn->spawned(new SpawnedPart($queued, $process));
    }
}
