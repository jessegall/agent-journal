<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use Domain\Plans\Contracts\PlanReviewEvent;

/**
 * A plan review edition was approved.
 */
final readonly class PlanReviewEditionApproved extends PlanEvent implements PlanReviewEvent
{
    public function __construct(
        public string $editionId,
    ) {}
}
