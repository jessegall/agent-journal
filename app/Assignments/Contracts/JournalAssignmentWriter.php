<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Assignments\Support\JournalAssignment;

interface JournalAssignmentWriter
{
    public function assignForJournal(JournalAssignment $assignment): AssignmentResult;

    public function reassignForJournal(JournalAssignment $assignment, AssignmentReference $expected): AssignmentResult;
}
