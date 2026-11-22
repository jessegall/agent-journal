<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\AutoAssignmentBudget;
use App\Support\AutoAssignmentRun;

interface AutoAssignmentTrigger
{
    public function consider(AutoAssignmentBudget $budget): AutoAssignmentRun;
}
