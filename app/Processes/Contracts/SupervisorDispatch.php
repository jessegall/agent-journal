<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Asks\Enums\SupervisorDispatchOutcome;
use App\Processes\Values\SupervisorRequest;

/**
 * Starts the helper a supervisor profile names when an ask is routed to it and no helper of it runs. Helpers implements
 * it; without Helpers every start is unavailable.
 */
interface SupervisorDispatch
{
    /**
     * Starts the supervisor the request asks for, or says why none started.
     */
    public function startFor(SupervisorRequest $request): SupervisorDispatchOutcome;
}
