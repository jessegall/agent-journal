<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\ActorContext;

/**
 * A plan was finished, and who finished it. Raised only once the change has committed.
 */
final readonly class PlanFinished extends PlanEvent implements ClientUpdate
{
    public function __construct(
        public string $planId,
        public ActorContext $finishedBy,
    ) {}
}
