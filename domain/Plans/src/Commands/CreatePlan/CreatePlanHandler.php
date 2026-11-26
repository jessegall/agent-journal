<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\CreatePlan;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Models\Plan;

final readonly class CreatePlanHandler extends PlanCommandHandler
{
    public function handle(CreatePlanCommand $command): string
    {
        $creator = $command->dispatchedBy();

        return Plan::create($command->title, $command->brief, $command->type, $creator, $command->owner())->id;
    }
}
