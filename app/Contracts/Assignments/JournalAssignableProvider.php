<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\JournalAssignment;
use App\Support\RecordIdentity;

interface JournalAssignableProvider extends AssignableProvider
{
    public function requireJournalAssignment(JournalAssignment $assignment): void;

    public function assertJournalRelease(RecordIdentity $record): void;
}
