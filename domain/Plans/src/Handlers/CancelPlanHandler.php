<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CancelPlanHandler extends PlanCommandHandler
{
    public function __construct(private Dispatcher $events) {}

    /**
     * @throws PlanRevisionChanged
     */
    public function handle(CancelPlan $command): void
    {
        $plan = $this->lockPlanAtRevision($command->planId, $command->expectedRevision);

        $plan->cancel($command->reason);
        $this->events->dispatch(new PlanCancelled($plan->id, $command->dispatchedBy()));
    }
}
