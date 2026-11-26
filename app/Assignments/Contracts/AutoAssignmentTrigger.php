<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\AutoAssignmentBudget;
use App\Assignments\AutoAssignmentRun;

interface AutoAssignmentTrigger
{
    /**
     * Hands out what automatic assignment may within the budget, and reports what it did.
     */
    public function consider(AutoAssignmentBudget $budget): AutoAssignmentRun;
}
