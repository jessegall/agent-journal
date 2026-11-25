<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\Sources\Contracts\DockSourceChanged;
use Domain\Plans\Models\Plan;

/**
 * The plan's task counts moved: a task in one of its phases changed state, or tasks were placed in it. It carries the
 * finished and total counts and when they were counted, so a reader keeps the newest when two arrive out of order.
 */
final readonly class PlanProgressChanged extends PlanEvent implements ClientUpdate, DockSourceChanged
{
    public function __construct(
        public string $planId,
        public int $planNumber,
        public int $hasFinished,
        public int $total,
        public int $countedAtMicroseconds,
    ) {}

    public function dockType(): string
    {
        return Plan::linkType();
    }

    public function dockId(): string
    {
        return $this->planId;
    }
}
