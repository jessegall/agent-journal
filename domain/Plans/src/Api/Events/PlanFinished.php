<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Actors\Support\ActorContext;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A plan was finished, and who finished it. Raised only once the change has committed.
 */
final readonly class PlanFinished implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public ActorContext $finishedBy,
    ) {}
}
