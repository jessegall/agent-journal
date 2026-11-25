<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Events\Event;

/**
 * A fact about plans, their phases and reviews: every event of that subject implements it, so a listener typed on it hears them all.
 */
interface PlanEvent extends Event
{
    public string $planId { get; }
}
