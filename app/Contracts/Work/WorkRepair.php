<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Enums\WorkRepairOutcome;
use App\Values\WorkRepairRequest;

/**
 * Reopens reviewed work for repair on the actor and checkout that did it, with the findings; the domain that owns the
 * work does it, and without one the repair is unavailable.
 */
interface WorkRepair
{
    /**
     * Opens the work again as the request asks, so its holder can mend it, and says what came of it.
     */
    public function reopen(WorkRepairRequest $request): WorkRepairOutcome;
}
