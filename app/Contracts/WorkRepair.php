<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\WorkRepairOutcome;
use App\Values\WorkRepairRequest;

/**
 * Reopens reviewed work for repair on the actor and checkout that did it, with the findings; the domain that owns the
 * work does it, and without one the repair is unavailable.
 */
interface WorkRepair
{
    public function reopen(WorkRepairRequest $request): WorkRepairOutcome;
}
