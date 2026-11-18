<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use Closure;

/**
 * The one way to change who is responsible for a record. The admitted owner and a main agent may give work to any
 * eligible actor; no other agent may. A change of an existing holding names the reference it read, so a stale view
 * is refused.
 *
 * @throws AssignmentDenied
 * @throws AssigneeUnavailable
 * @throws RecordUnavailable
 * @throws AssignmentConflict
 * @throws AssignmentRootFinished
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

    /**
     * Gives a root record and every unfinished record its owner collects under it to the recipient. The root must be
     * unheld or held by the recipient; finished records are skipped and a finished root is refused. The collection
     * runs again when the transaction does, so it only touches the database.
     *
     * @param  Closure(): AssignmentGroup  $records
     */
    public function assignUnfinished(ActorIdentity $recipient, Closure $records): AssignmentResult;

    /**
     * @param  Closure(): AssignmentGroup  $records
     */
    public function reassignUnfinished(AssignmentReference $expectedRoot, ActorIdentity $recipient, Closure $records): AssignmentResult;

    /**
     * @param  Closure(): AssignmentGroup  $records
     */
    public function unassignUnfinished(AssignmentReference $expectedRoot, Closure $records): AssignmentResult;
}
