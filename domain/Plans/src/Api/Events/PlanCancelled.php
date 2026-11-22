<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Actors\Support\ActorContext;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A plan was cancelled, and who cancelled it. Raised only once the change has committed.
 */
final readonly class PlanCancelled implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public ActorContext $cancelledBy,
    ) {}
}
