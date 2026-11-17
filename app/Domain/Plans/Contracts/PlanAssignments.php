<?php

declare(strict_types=1);

namespace App\Domain\Plans\Contracts;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\RecordIdentity;

/**
 * Gives out, reassigns or releases the unfinished work of a whole plan or phase at once: the root and every unfinished
 * phase and task under it. Assigning the root alone stays a single-record command of Core's writer.
 */
interface PlanAssignments
{
    public function assign(RecordIdentity $root, ActorIdentity $recipient): AssignmentResult;

    public function reassign(RecordIdentity $root, AssignmentReference $expectedRoot, ActorIdentity $recipient): AssignmentResult;

    public function unassign(RecordIdentity $root, AssignmentReference $expectedRoot): AssignmentResult;
}
