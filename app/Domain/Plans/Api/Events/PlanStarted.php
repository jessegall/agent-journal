<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api\Events;

use App\Core\Actors\Support\ActorContext;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A plan started, and who started it. Raised only once the start has committed, so a listener never hears of a start
 * that rolled back.
 */
final readonly class PlanStarted implements ShouldDispatchAfterCommit
{
    public function __construct(
        public int $planId,
        public ActorContext $startedBy,
    ) {}
}
