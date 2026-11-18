<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Actors\Support\ActorContext;
use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A plan started, and who started it. Raised only once the start has committed, so a listener never hears of a start
 * that rolled back.
 */
final readonly class PlanStarted implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(
        public string $planId,
        public ActorContext $startedBy,
    ) {}
}
