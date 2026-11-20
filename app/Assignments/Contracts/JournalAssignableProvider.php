<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\JournalAssignment;
use App\Records\Support\RecordIdentity;

interface JournalAssignableProvider extends AssignableProvider
{
    public function requireJournalAssignment(JournalAssignment $assignment): void;

    public function assertJournalRelease(RecordIdentity $record): void;
}
