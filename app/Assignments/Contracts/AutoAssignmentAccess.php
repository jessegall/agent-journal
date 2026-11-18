<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Contracts\Actor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AutoAssignmentDenied;

/**
 * Who may read and who may change an actor's auto-assignments. Selection code never receives it.
 */
interface AutoAssignmentAccess
{
    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function requireRead(Actor $actor, ActorIdentity $target): void;

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function requireWrite(Actor $actor, ActorIdentity $target): void;

    /**
     * Whether the reader may see the target's held count and room, asked once requireRead has passed: an actor
     * reading its own auto-assignment sees only its safe status.
     */
    public function mayReadTotals(Actor $actor, ActorIdentity $target): bool;
}
