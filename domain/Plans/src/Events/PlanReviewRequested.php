<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\ActorReference;
use Domain\Plans\Contracts\PlanReviewEvent;

/**
 * A plan was put up for review by the reviewers it names. Raised only once the request has committed.
 */
final readonly class PlanReviewRequested implements ClientUpdate, PlanEvent, PlanReviewEvent
{
    /**
     * @param  list<ActorReference>  $reviewers
     */
    public function __construct(
        public string $planId,
        public string $editionId,
        public array $reviewers,
        public int $planNumber,
    ) {}
}
