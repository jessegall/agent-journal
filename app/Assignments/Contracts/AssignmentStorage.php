<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentResult;
use App\Records\Support\RecordIdentity;
use PhpOption\Option;

/**
 * The assignment rows other Core areas read and change inside their own transaction: lock a record's current
 * assignment, give an unheld record to a holder, or release everything an actor holds.
 */
interface AssignmentStorage
{
    /**
     * The record's current assignment, its row locked for update.
     *
     * @return Option<Assignment>
     */
    public function lockCurrent(RecordIdentity $record): Option;

    /**
     * Gives an unheld record to the holder and answers the record's assignment afterwards: the new one, or the one
     * another transaction made first.
     */
    public function assignIfUnheld(RecordIdentity $record, AssigneeIdentity $holder): Assignment;

    /**
     * Removes every assignment the actor holds, of every record type, for Core's retirement of that actor.
     */
    public function releaseAll(AssigneeIdentity $holder): AssignmentResult;
}
