<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Support\AssignmentReference;
use App\Desks\Contracts\Desk;

/**
 * A seat an actor holds: the desk it is at and the exact assignment that seats the actor there.
 */
final readonly class OccupiedSeat
{
    public function __construct(public Desk $desk, public AssignmentReference $reference) {}
}
