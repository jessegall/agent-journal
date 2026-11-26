<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Exceptions\AssignmentConflict;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Support\AssigneeIdentity;
use App\Support\Assignment;
use App\Support\AssignmentReference;
use App\Support\RecordIdentity;

/**
 * Core's own writer of internal responsibilities, such as desk seats: it writes by exact reference without the public
 * assignment checks, which its callers have already made, and refuses every public record type.
 */
interface ResponsibilityWriter
{
    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentConflict
     */
    public function assign(RecordIdentity $record, AssigneeIdentity $holder): Assignment;

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentConflict
     */
    public function replace(
        RecordIdentity $record,
        AssignmentReference $expected,
        AssigneeIdentity $holder,
    ): Assignment;

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentConflict
     */
    public function release(RecordIdentity $record, AssignmentReference $expected): void;
}
