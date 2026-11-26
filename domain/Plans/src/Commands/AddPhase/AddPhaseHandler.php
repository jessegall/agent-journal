<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\AddPhase;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;

/**
 * Adds the phase under the plan's row lock, so two phases added at once get two numbers.
 */
final readonly class AddPhaseHandler extends PlanCommandHandler
{
    public function __construct(private PlanStructure $structure) {}

    public function handle(AddPhaseCommand $command): string
    {
        $plan = Plan::query()->findOr($command->planId, PlanMissing::throwing()->withId($command->planId));

        return $this->structure->addPhase($plan, $command->title)->getKey();
    }
}
