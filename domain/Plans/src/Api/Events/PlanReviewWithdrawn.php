<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A plan's review was withdrawn before a decision and the plan is Planned again. Raised only once that has committed.
 */
final readonly class PlanReviewWithdrawn implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public string $editionId,
    ) {}
}
