<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\AssignmentGroup;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Exceptions\AssigneeUnavailable;
use App\Exceptions\AssignmentDenied;
use App\Exceptions\RecordUnavailable;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
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
    public function assign(RecordIdentity $record, AssigneeIdentity $recipient): AssignmentResult;

    /**
     * Moves the record from the assignment it holds now, which must still be the expected one, to the recipient.
     */
    public function reassign(
        RecordIdentity $record,
        AssignmentReference $expected,
        AssigneeIdentity $recipient,
    ): AssignmentResult;

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
    public function assignUnfinished(AssigneeIdentity $recipient, Closure $records): AssignmentResult;

    /**
     * @param  Closure(): AssignmentGroup  $records
     */
    public function reassignUnfinished(
        AssignmentReference $expectedRoot,
        AssigneeIdentity $recipient,
        Closure $records,
    ): AssignmentResult;

    /**
     * @param  Closure(): AssignmentGroup  $records
     */
    public function unassignUnfinished(AssignmentReference $expectedRoot, Closure $records): AssignmentResult;
}
