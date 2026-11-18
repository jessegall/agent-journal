<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Support\StackTarget;
use App\Contracts\CommandHandler;
use App\Hooks\Contracts\AgentStack;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Models\Plan;
use Domain\Plans\States\Support\WorkingOnPlanStateReference;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts the plan once, under its row lock, by the same rule the plans read offers. An agent that starts it gets the
 * plan's working frame on its stack in the same transaction, so its current plan is read from the stack; a user's start
 * changes no stack. PlanStarted is raised only when the plan changed.
 */
final readonly class StartPlanHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private Dispatcher $events,
        private CurrentSession $session,
        private AgentStack $stacks,
    ) {}

    public function handle(StartPlan $command): void
    {
        $plan = Plan::query()->whereKey($command->planId)->lockForUpdate()->first() ?? throw PlanMissing::withId($command->planId);

        if (! $plan->startOnce()) {
            return;
        }

        $actor = $this->actors->actor();

        if (! $actor->isUser()) {
            $this->stacks->push(new StackTarget($actor->actorId(), $this->session->sessionId()), WorkingOnPlanStateReference::forPlan($plan));
        }

        $this->events->dispatch(new PlanStarted($plan->id, $actor));
    }
}
