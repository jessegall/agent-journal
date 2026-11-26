<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Execution\QueuedPart;
use App\Processes\Execution\SpawnedPart;

/**
 * What SpawnPart starts the next part of: one queued part, or the commands of a pipeline in turn. It names the part to
 * start and what the run holds once that part started or was refused.
 */
interface SpawnablePart
{
    /**
     * The queued part to start next.
     */
    public function nextSpawnable(): QueuedPart;

    /**
     * What the run holds once that part started.
     */
    public function spawned(SpawnedPart $part): object;

    /**
     * What the run holds once that part was refused, for the reason given.
     */
    public function refused(string $reason): object;
}
