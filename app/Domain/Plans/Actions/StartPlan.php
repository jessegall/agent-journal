<?php

declare(strict_types=1);

namespace App\Domain\Plans\Actions;

use App\Core\Actors\ActorContext;
use App\Domain\Plans\Events\PlanStarted;
use App\Domain\Plans\Models\Plan;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;

/**
 * Starts a plan for the actor of this request, a user or an agent alike: once, under the plan's row lock, by the
 * same rule the plans read offers. Starting an already started plan changes nothing and raises nothing.
 */
final readonly class StartPlan
{
    public function __construct(
        private ActorContext $actor,
        private ConnectionInterface $database,
        private Dispatcher $events,
    ) {}

    public function start(Plan $plan): void
    {
        $this->database->transaction(function () use ($plan): void {
            $locked = Plan::query()->whereKey($plan->id)->lockForUpdate()->sole();

            if ($locked->startOnce()) {
                $this->events->dispatch(new PlanStarted($locked->id, $this->actor));
            }
        });
    }
}
