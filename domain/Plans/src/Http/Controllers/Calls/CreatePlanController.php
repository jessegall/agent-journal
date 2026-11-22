<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Calls\CreatePlanCall;
use Domain\Plans\Calls\PlanNamed;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;

/**
 * Drafts a plan and answers its id.
 */
final readonly class CreatePlanController
{
    public function __invoke(CreatePlanCall $call, CommandBus $commands): PlanNamed
    {
        return PlanNamed::from(['planId' => $commands->run(new CreatePlanCommand($call->title, $call->brief, $call->type))]);
    }
}
