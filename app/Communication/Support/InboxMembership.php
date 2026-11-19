<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentReference;

/**
 * One actor's membership of an inbox with the exact participation assignment that proves it.
 */
final readonly class InboxMembership
{
    public function __construct(public ActorIdentity $actor, public AssignmentReference $seatReference) {}
}
