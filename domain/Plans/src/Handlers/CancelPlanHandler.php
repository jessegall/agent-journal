<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Contracts\CommandHandler;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Models\Plan;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CancelPlanHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    /**
     * @throws PlanRevisionChanged
     */
    public function handle(CancelPlan $command): void
    {
        $plan = Plan::lockStructure($command->planId);

        if ($plan->revision !== $command->expectedRevision) {
            throw PlanRevisionChanged::for($plan->number, $command->expectedRevision, $plan->revision);
        }

        $plan->cancel($command->reason);
        $this->events->dispatch(new PlanCancelled($plan->id, $command->dispatchedBy()));
    }
}
