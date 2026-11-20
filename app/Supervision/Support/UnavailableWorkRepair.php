<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Supervision\Contracts\WorkRepair;
use App\Supervision\Enums\WorkRepairOutcome;
use App\Supervision\Values\WorkRepairRequest;

/**
 * Without a domain that owns the work, no repair can reopen it; the request stays pending and visible.
 */
final readonly class UnavailableWorkRepair implements WorkRepair
{
    public function reopen(WorkRepairRequest $request): WorkRepairOutcome
    {
        return WorkRepairOutcome::Unavailable;
    }
}
