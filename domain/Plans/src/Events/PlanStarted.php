<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\ActorReference;

/**
 * A plan started, and who started it. Raised only once the start has committed, so a listener never receives a start
 * that rolled back.
 */
final readonly class PlanStarted implements ClientUpdate, PlanEvent
{
    public function __construct(
        public string $planId,
        public ActorReference $startedBy,
    ) {}
}
