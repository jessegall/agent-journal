<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Contracts\AssignmentRoom;

/**
 * The room left under the configured size: the size less what the actor holds, never below 0.
 */
final readonly class SizeAssignmentRoom implements AssignmentRoom
{
    public function available(AutoAssignmentFact $fact, int $held): int
    {
        return max(0, $fact->size - $held);
    }
}
