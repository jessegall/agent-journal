<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\ActorIdentity;

/**
 * A plan was finished, and who finished it. Raised only once the change has committed.
 */
final readonly class PlanFinished implements ClientUpdate, PlanEvent
{
    public function __construct(
        public string $planId,
        public ActorIdentity $finishedBy,
    ) {}
}
