<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Hooks\Contracts\ActorWorkStacks;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\States\Support\WorkingOnPlanStateReference;

/**
 * Puts the started plan on the starting agent's stack in the same transaction as the start, so both commit or neither
 * does; a user's start has no stack and changes none.
 */
#[InCommandTransaction]
final readonly class PushPlanState implements Listener
{
    public function __construct(private ActorWorkStacks $workStack) {}

    public function handle(PlanStarted $event): void
    {
        $this->workStack->push(WorkingOnPlanStateReference::forPlan($event->planId));
    }
}
