<?php

declare(strict_types=1);

namespace App\Core\Assignments\Contracts;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Exceptions\AssigneeUnavailable;
use App\Core\Assignments\Exceptions\AssignmentConflict;
use App\Core\Assignments\Exceptions\AssignmentDenied;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\RecordIdentity;

/**
 * The one way to change who is responsible for a record. The admitted owner and a main agent may give work to any
 * eligible actor; no other agent may. A change of an existing holding names the reference it read, so a stale view
 * is refused.
 *
 * @throws AssignmentDenied
 * @throws AssigneeUnavailable
 * @throws RecordUnavailable
 * @throws AssignmentConflict
 */
interface AssignmentWriter
{
    /**
     * Gives an unheld record to the recipient; the same holder is unchanged, another holder is a conflict.
     */
    public function assign(RecordIdentity $record, ActorIdentity $recipient): AssignmentResult;

    public function reassign(RecordIdentity $record, AssignmentReference $expected, ActorIdentity $recipient): AssignmentResult;

    /**
     * Releases the record; a record nobody holds is unchanged.
     */
    public function unassign(RecordIdentity $record, AssignmentReference $expected): AssignmentResult;
}
