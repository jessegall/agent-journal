<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Events;

final readonly class PlanStarted
{
    public function __construct(public int $planId) {}
}
