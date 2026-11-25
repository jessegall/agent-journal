<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Api\FinishPlanPayload;
use Domain\Plans\Api\PlanNamed;
use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;

/**
 * Finishes a plan.
 */
final readonly class FinishPlanController
{
    public function __invoke(FinishPlanPayload $call, CommandBus $commands): PlanNamed
    {
        $commands->run(new FinishPlanCommand($call->planId, $call->expectedRevision, $call->note));

        return PlanNamed::from(['planId' => $call->planId]);
    }
}
