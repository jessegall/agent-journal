<?php

declare(strict_types=1);

namespace App\Supervision\Contracts;

use App\Supervision\Enums\SupervisorDispatchOutcome;
use App\Supervision\Values\SupervisorRequest;

/**
 * Starts the helper a supervisor profile names when an ask is routed to it and no helper of it runs. Helpers implements
 * it; without Helpers every start is unavailable.
 */
interface SupervisorDispatch
{
    public function startFor(SupervisorRequest $request): SupervisorDispatchOutcome;
}
