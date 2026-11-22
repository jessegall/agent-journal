<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Events;

use App\Contracts\Events\Event;

final readonly class PlanStarted implements Event
{
    public function __construct(public int $planId) {}
}
