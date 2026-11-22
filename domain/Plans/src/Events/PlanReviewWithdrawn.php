<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;

/**
 * A plan's review was withdrawn before a decision and the plan is Planned again. Raised only once that has committed.
 */
final readonly class PlanReviewWithdrawn implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public string $editionId,
    ) {}
}
