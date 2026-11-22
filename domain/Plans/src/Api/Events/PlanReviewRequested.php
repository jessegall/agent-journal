<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A plan was put up for review by the reviewers it names. Raised only once the request has committed.
 */
final readonly class PlanReviewRequested implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public string $editionId,
        /** @var list<ActorIdentity> */
        public array $reviewers,
    ) {}
}
