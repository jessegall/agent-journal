<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A plan was put up for review with its frozen edition. Raised only once the request has committed.
 */
final readonly class PlanReviewRequested implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $planId,
        public string $editionId,
    ) {}
}
