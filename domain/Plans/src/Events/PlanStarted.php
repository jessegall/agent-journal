<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorContext;

/**
 * A plan started, and who started it. Raised only once the start has committed, so a listener never receives a start
 * that rolled back.
 */
final readonly class PlanStarted extends PlanEvent implements UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public ActorContext $startedBy,
    ) {}
}
