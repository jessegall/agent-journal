<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\JournalAssignment;
use App\Support\RecordIdentity;

interface JournalAssignmentWriter
{
    public function assignForJournal(JournalAssignment $assignment): AssignmentResult;

    public function reassignForJournal(JournalAssignment $assignment, AssignmentReference $expected): AssignmentResult;

    public function releaseForJournal(RecordIdentity $record): void;
}
