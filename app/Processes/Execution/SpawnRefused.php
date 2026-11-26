<?php

declare(strict_types=1);

namespace App\Processes\Execution;

/**
 * A part whose process did not start, stale or not found, with the reason recorded for it.
 */
final readonly class SpawnRefused
{
    public function __construct(public QueuedPart $queued, public string $reason) {}
}
