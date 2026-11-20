<?php

declare(strict_types=1);

namespace App\Supervision\Contracts;

use App\Supervision\Enums\WorkRepairOutcome;
use App\Supervision\Values\WorkRepairRequest;

/**
 * Reopens reviewed work for repair on the actor and checkout that did it, with the findings; the domain that owns the
 * work does it, and without one the repair is unavailable.
 */
interface WorkRepair
{
    public function reopen(WorkRepairRequest $request): WorkRepairOutcome;
}
