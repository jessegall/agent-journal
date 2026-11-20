<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AutoAssignmentBudget;
use App\Assignments\Support\AutoAssignmentRun;

interface AutoAssignmentTrigger
{
    public function consider(AutoAssignmentBudget $budget): AutoAssignmentRun;
}
