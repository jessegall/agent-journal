<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Assignments\Support\JournalAssignment;
use App\Records\Support\RecordIdentity;

interface JournalAssignmentWriter
{
    public function assignForJournal(JournalAssignment $assignment): AssignmentResult;

    public function reassignForJournal(JournalAssignment $assignment, AssignmentReference $expected): AssignmentResult;

    public function releaseForJournal(RecordIdentity $record): void;
}
