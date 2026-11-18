<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Assignments\Exceptions\AutoAssignmentMissing;
use App\Assignments\Exceptions\AutoAssignmentRevisionChanged;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;

/**
 * Changes an actor's auto-assignment of one type inside the command bus's transaction, each change made against the
 * revision the caller read: a stale revision always fails and changes nothing. A missing auto-assignment is off, at
 * revision 0.
 */
interface AutoAssignmentWriter
{
    /**
     * Turns it on with the pool and size, creating it on its first enable.
     *
     * @throws AssignmentTransactionRequired
     * @throws AutoAssignmentRevisionChanged
     */
    public function enable(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange;

    /**
     * Gives an existing one a new pool and size, leaving it on or off as it is.
     *
     * @throws AssignmentTransactionRequired
     * @throws AutoAssignmentMissing
     * @throws AutoAssignmentRevisionChanged
     */
    public function configure(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange;

    /**
     * Turns it off, keeping its pool and size.
     *
     * @throws AssignmentTransactionRequired
     * @throws AutoAssignmentRevisionChanged
     */
    public function disable(AutoAssignmentKey $key, int $expectedRevision): AutoAssignmentChange;
}
