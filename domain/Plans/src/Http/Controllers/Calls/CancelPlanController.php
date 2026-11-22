<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Contracts\CommandBus;
use Domain\Plans\Calls\CancelPlanCall;
use Domain\Plans\Calls\PlanNamed;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;

/**
 * Cancels a plan.
 */
final readonly class CancelPlanController
{
    public function __invoke(CancelPlanCall $call, CommandBus $commands): PlanNamed
    {
        $commands->run(new CancelPlanCommand($call->planId, $call->expectedRevision, $call->reason));

        return PlanNamed::from(['planId' => $call->planId]);
    }
}
