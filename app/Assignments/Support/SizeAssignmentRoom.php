<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Exceptions\InvalidHeldCount;

/**
 * The room left under the configured size: the size less what the actor holds, never below 0.
 */
final readonly class SizeAssignmentRoom
{
    public function available(AutoAssignmentFact $fact, int $held): int
    {
        if ($held < 0) {
            throw InvalidHeldCount::negative($held);
        }

        return max(0, $fact->size - $held);
    }
}
