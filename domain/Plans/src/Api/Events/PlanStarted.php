<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Actors\Support\ActorContext;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A plan started, and who started it. Raised only once the start has committed, so a listener never receives a start
 * that rolled back.
 */
final readonly class PlanStarted implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public ActorContext $startedBy,
    ) {}
}
