<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Supervision\Contracts\SupervisorDispatch;
use App\Supervision\Enums\SupervisorDispatchOutcome;
use App\Supervision\Values\SupervisorRequest;

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
