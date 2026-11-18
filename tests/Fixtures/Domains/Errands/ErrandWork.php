<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignedWorkProvider;

/**
 * Counts no errand held by anyone.
 */
final class ErrandWork implements AssignedWorkProvider
{
    public function countFor(ActorIdentity $holder): int
    {
        return 0;
    }
}
