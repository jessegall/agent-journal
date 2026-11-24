<?php

declare(strict_types=1);

namespace App\Support\Execution;

/**
 * What SpawnPart starts the next part of: one queued part, or the commands of a pipeline in turn. It names the part to
 * start and what the run holds once that part started or was refused.
 */
interface PartToSpawn
{
    public function nextToSpawn(): QueuedPart;

    public function spawned(SpawnedPart $part): object;

    public function refused(string $reason): object;
}
