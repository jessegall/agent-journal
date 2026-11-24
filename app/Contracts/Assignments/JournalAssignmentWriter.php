<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\JournalAssignment;
use App\Support\RecordIdentity;

interface JournalAssignmentWriter
{
    /**
     * Makes an assignment the journal's own tools asked for, after its provider allows it.
     */
    public function assignForJournal(JournalAssignment $assignment): AssignmentResult;

    /**
     * Moves an assignment for the journal's own tools, when the record still holds the expected one.
     */
    public function reassignForJournal(JournalAssignment $assignment, AssignmentReference $expected): AssignmentResult;

    /**
     * Ends the record's assignment for the journal's own tools, after its provider allows it.
     */
    public function releaseForJournal(RecordIdentity $record): void;
}
