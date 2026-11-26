<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Api\CancelPlanPayload;
use Domain\Plans\Api\PlanNamed;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;

/**
 * Cancels a plan.
 */
final readonly class CancelPlanController
{
    #[Dispatches(CancelPlanCommand::class)]
    public function __invoke(CancelPlanPayload $call, CommandBus $commands): PlanNamed
    {
        $commands->run(new CancelPlanCommand($call->planId, $call->expectedRevision, $call->reason));

        return PlanNamed::from(['planId' => $call->planId]);
    }
}
