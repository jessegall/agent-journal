<?php

declare(strict_types=1);

namespace App\Support\Execution;

/**
 * A started part whose output was read while it ran: the standard output kept for a substitution, and whether the
 * output was read to its end before the drain stopped.
 */
final readonly class DrainedPart
{
    public function __construct(public SpawnedPart $spawned, public string $stdout, public bool $isDrained) {}
}
