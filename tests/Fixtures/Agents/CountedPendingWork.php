<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Support\ActorIdentity;
use App\Contracts\PendingWorkSource;

/**
 * A module's pending work as a test sets it: the same count for every actor.
 */
final class CountedPendingWork implements PendingWorkSource
{
    public static int $count = 0;

    public function pendingCount(ActorIdentity $actor): int
    {
        return self::$count;
    }
}
