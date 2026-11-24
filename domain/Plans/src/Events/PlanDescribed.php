<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

/**
 * A plan's title, brief or type changed.
 */
final readonly class PlanDescribed extends PlanEvent
{
    public function __construct(public string $planId, public int $revision) {}
}
