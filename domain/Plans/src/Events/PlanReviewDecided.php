<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;
use Domain\Plans\Enums\PlanReviewState;

/**
 * A plan's review edition was decided, approved or sent back for changes, and the plan is Planned again. Raised only
 * once the decision has committed.
 */
final readonly class PlanReviewDecided implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public string $editionId,
        public PlanReviewState $decision,
    ) {}
}
