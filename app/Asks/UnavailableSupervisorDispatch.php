<?php

declare(strict_types=1);

namespace App\Asks;

use App\Asks\Enums\SupervisorDispatchOutcome;
use App\Processes\Contracts\SupervisorDispatch;
use App\Processes\Values\SupervisorRequest;

/**
 * The supervisor dispatch while no domain provides helpers: no start is possible, so the ask waits and escalates.
 */
final readonly class UnavailableSupervisorDispatch implements SupervisorDispatch
{
    public function startFor(SupervisorRequest $request): SupervisorDispatchOutcome
    {
        return SupervisorDispatchOutcome::Unavailable;
    }
}
