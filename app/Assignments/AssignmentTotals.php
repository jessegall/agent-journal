<?php

declare(strict_types=1);

namespace App\Assignments;

/**
 * How many unfinished items of the type the actor holds, and how many more it may be given.
 */
final readonly class AssignmentTotals
{
    public function __construct(
        public int $held,
        public int $room,
    ) {}
}
