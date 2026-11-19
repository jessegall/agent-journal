<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Calls\FinishPlanCall;
use Domain\Plans\Calls\PlanNamed;
use Domain\Plans\Commands\FinishPlan;

/**
 * Finishes a plan.
 */
final readonly class FinishPlanController
{
    public function __invoke(FinishPlanCall $call, CommandBus $commands): PlanNamed
    {
        $commands->run(new FinishPlan($call->planId, $call->expectedRevision, $call->note));

        return PlanNamed::from(['planId' => $call->planId]);
    }
}
