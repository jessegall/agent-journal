<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Api\CreatePlanPayload;
use Domain\Plans\Api\PlanNamed;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;

/**
 * Drafts a plan and answers its id.
 */
final readonly class CreatePlanController
{
    public function __invoke(CreatePlanPayload $call, CommandBus $commands): PlanNamed
    {
        return PlanNamed::from(
            ['planId' => $commands->run(new CreatePlanCommand($call->title, $call->brief, $call->type))],
        );
    }
}
