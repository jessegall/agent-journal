<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Contracts\CommandHandler;
use Domain\Plans\Commands\EditPlan;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Models\Plan;

final readonly class EditPlanHandler implements CommandHandler
{
    /**
     * @throws PlanRevisionChanged
     */
    public function handle(EditPlan $command): int
    {
        $plan = Plan::lockStructure($command->planId);

        if ($plan->revision !== $command->expectedRevision) {
            throw PlanRevisionChanged::for($plan->number, $command->expectedRevision, $plan->revision);
        }

        $plan->describe($command->title ?? $plan->title, $command->brief ?? $plan->brief, $command->type ?? $plan->type);

        return $plan->revision;
    }
}
