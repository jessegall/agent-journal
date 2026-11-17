<?php

declare(strict_types=1);

namespace App\Domain\Plans\Actions;

use App\Core\Contracts\CurrentActor;
use App\Domain\Plans\Contracts\PlanStarter;
use App\Domain\Plans\Events\PlanStarted;
use App\Domain\Plans\Exceptions\PlanMissing;
use App\Domain\Plans\Models\Plan;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;

/**
 * Starts a plan for the actor of this request, a user or an agent alike: once, under the plan's row lock, by the
 * same rule the plans read offers. Starting an already started plan changes nothing and raises nothing.
 */
#[Scoped]
final readonly class StartPlan implements PlanStarter
{
    public function __construct(
        private CurrentActor $actors,
        private ConnectionInterface $database,
        private Dispatcher $events,
    ) {}

    public function start(int $planId): void
    {
        $actor = $this->actors->actor();

        $this->database->transaction(function () use ($planId, $actor): void {
            $locked = Plan::query()->whereKey($planId)->lockForUpdate()->first() ?? throw PlanMissing::withId($planId);

            if ($locked->startOnce()) {
                $this->events->dispatch(new PlanStarted($locked->id, $actor));
            }
        });
    }
}
