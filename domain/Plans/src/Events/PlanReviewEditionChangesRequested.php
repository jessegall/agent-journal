<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use Domain\Plans\Contracts\PlanReviewEvent;

/**
 * A plan review edition was sent back with the changes asked for.
 */
final readonly class PlanReviewEditionChangesRequested extends PlanEvent implements PlanReviewEvent
{
    public function __construct(
        public string $editionId,
    ) {}
}
