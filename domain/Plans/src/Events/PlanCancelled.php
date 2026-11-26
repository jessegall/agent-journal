<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Navigation\Contracts\ClientUpdate;
use App\Support\ActorReference;

/**
 * A plan was cancelled, and who cancelled it. Raised only once the change has committed.
 */
final readonly class PlanCancelled implements ClientUpdate, PlanEvent
{
    public function __construct(
        public string $planId,
        public ActorReference $cancelledBy,
    ) {}
}
