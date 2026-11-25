<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Projects\ProjectDestination;
use Domain\Plans\Api\CreatePlanPayload;
use Domain\Plans\Api\PlanNamed;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use PhpOption\None;

/**
 * Drafts a plan and answers its id.
 */
final readonly class CreatePlanController
{
    #[Dispatches(CreatePlanCommand::class)]
    public function __invoke(CreatePlanPayload $call, CommandBus $commands, ProjectDestination $destination): PlanNamed
    {
        $project = $destination->projectFor(None::create());

        return PlanNamed::from(
            ['planId' => $commands->run(new CreatePlanCommand($call->title, $call->brief, $call->type, $project))],
        );
    }
}
