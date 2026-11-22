<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\Desk;

/**
 * A seat an actor holds: the desk it is at and the exact assignment that seats the actor there.
 */
final readonly class OccupiedSeat
{
    public function __construct(public Desk $desk, public AssignmentReference $reference) {}
}
