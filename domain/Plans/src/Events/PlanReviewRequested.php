<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorIdentity;
use Domain\Plans\Contracts\PlanReviewEvent;

/**
 * A plan was put up for review by the reviewers it names. Raised only once the request has committed.
 */
final readonly class PlanReviewRequested extends PlanEvent implements PlanReviewEvent, UserInterfaceUpdater
{
    /**
     * @param  list<ActorIdentity>  $reviewers
     */
    public function __construct(
        public string $planId,
        public string $editionId,
        public array $reviewers,
        public int $planNumber,
    ) {}
}
