<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Support\States\Support\WorkOnPlanStateReference;

/**
 * Puts the started plan on the starting agent's stack in the same transaction as the start, so both commit or neither
 * does; a user's start has no stack and changes none.
 */
#[InCommandTransaction]
final readonly class PushPlanState implements Listener
{
    public function __construct(private AgentStack $stacks) {}

    public function handle(PlanStarted $event): void
    {
        $this->stacks->activateForCaller(WorkOnPlanStateReference::forPlan($event->planId));
    }
}
