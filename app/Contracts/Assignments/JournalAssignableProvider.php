<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\JournalAssignment;
use App\Support\RecordIdentity;

interface JournalAssignableProvider extends AssignableProvider
{
    /**
     * Refuses when the journal's tools may not make the assignment.
     */
    public function requireJournalAssignment(JournalAssignment $assignment): void;

    /**
     * Refuses when the journal's tools may not release the record's assignment.
     */
    public function assertJournalRelease(RecordIdentity $record): void;
}
