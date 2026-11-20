<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\JournalAssignment;

interface JournalAssignableProvider extends AssignableProvider
{
    public function requireJournalAssignment(JournalAssignment $assignment): void;
}
