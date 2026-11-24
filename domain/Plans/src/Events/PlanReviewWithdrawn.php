<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use Domain\Plans\Contracts\PlanReviewEvent;

/**
 * A plan's review was withdrawn before a decision and the plan is Planned again. Raised only once that has committed.
 */
final readonly class PlanReviewWithdrawn extends PlanEvent implements PlanReviewEvent, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public string $editionId,
    ) {}
}
