<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Assignments\Support\AssignmentReference;

/**
 * A desk membership, proved by the exact participation assignment of the seat the actor holds.
 */
final readonly class DeskSeatEvidence implements MembershipEvidence
{
    public function __construct(public AssignmentReference $seat) {}
}
