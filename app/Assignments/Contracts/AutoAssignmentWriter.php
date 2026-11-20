<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AutoAssignmentFact;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentOutcome;
use Closure;

interface AutoAssignmentWriter
{
    /**
     * Claims once against the locked configuration in the caller's repeatable-read transaction.
     *
     * @param Closure(AutoAssignmentFact): AutoAssignmentOutcome $claim
     */
    public function claim(AutoAssignmentKey $key, Closure $claim): AutoAssignmentOutcome;
}
