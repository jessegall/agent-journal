<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use Domain\Plans\Contracts\PlanReviewEvent;

/**
 * A plan review edition's approval no longer matches the plan, which changed after it.
 */
final readonly class PlanReviewEditionOutdated extends PlanEvent implements PlanReviewEvent
{
    public function __construct(
        public string $editionId,
    ) {}
}
