<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\SupervisorDispatch;
use App\Enums\SupervisorDispatchOutcome;
use App\Values\SupervisorRequest;

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
