<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Contracts\Actors\Actor;
use App\Exceptions\AssignmentDenied;
use App\Exceptions\AutoAssignmentDenied;
use App\Support\ActorReference;

/**
 * Who may read and who may change an actor's auto-assignments. Selection code never receives it.
 */
interface AutoAssignmentAccess
{
    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function assertMayRead(Actor $actor, ActorReference $target): void;

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function assertMayWrite(Actor $actor, ActorReference $target): void;

    /**
     * Whether the reader may see the target's held count and room, asked once requireRead has passed: an actor
     * reading its own auto-assignment sees only its safe status.
     */
    public function mayReadTotals(Actor $actor, ActorReference $target): bool;
}
