<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\ClientUpdate;
use Domain\Plans\Contracts\PlanReviewEvent;
use Domain\Plans\Enums\PlanReviewStatus;

/**
 * A plan's review edition was decided, approved or sent back for changes, and the plan is Planned again. Raised only
 * once the decision has committed.
 */
final readonly class PlanReviewDecided extends PlanEvent implements ClientUpdate, PlanReviewEvent
{
    public function __construct(
        public string $planId,
        public string $editionId,
        public PlanReviewStatus $decision,
    ) {}
}
