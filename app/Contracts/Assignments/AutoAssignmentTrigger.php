<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\AutoAssignmentBudget;
use App\Support\AutoAssignmentRun;

interface AutoAssignmentTrigger
{
    /**
     * Hands out what automatic assignment may within the budget, and reports what it did.
     */
    public function consider(AutoAssignmentBudget $budget): AutoAssignmentRun;
}
