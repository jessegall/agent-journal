<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Domain\Plans\Enums\PlanReviewState;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A plan's review edition was decided, approved or sent back for changes, and the plan is Planned again. Raised only
 * once the decision has committed.
 */
final readonly class PlanReviewDecided implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public string $editionId,
        public PlanReviewState $decision,
    ) {}
}
