<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Navigation\Contracts\ClientUpdate;
use App\Records\Contracts\RecordChanged;
use Domain\Plans\Models\Plan;

/**
 * The plan's task counts moved: a task in one of its phases changed state, or tasks were placed in it. It carries the
 * finished and total counts and when they were counted, so a reader keeps the newest when two arrive out of order.
 */
final readonly class PlanProgressChanged implements ClientUpdate, PlanEvent, RecordChanged
{
    public function __construct(
        public string $planId,
        public int $planNumber,
        public int $hasFinished,
        public int $total,
        public int $countedAtMicroseconds,
    ) {}

    public function recordType(): string
    {
        return Plan::linkType();
    }

    public function recordId(): string
    {
        return $this->planId;
    }
}
