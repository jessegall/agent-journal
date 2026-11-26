<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\AutoAssignmentOutcome;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentKey;
use Closure;

interface AutoAssignmentWriter
{
    /**
     * Claims once against the locked configuration in the caller's repeatable-read transaction.
     *
     * @param  Closure(AutoAssignmentFact): AutoAssignmentOutcome  $claim
     */
    public function claim(AutoAssignmentKey $key, Closure $claim): AutoAssignmentOutcome;
}
