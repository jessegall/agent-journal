<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Contracts\CommandHandler;
use Domain\Plans\Commands\AddPhase;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Models\Plan;

/**
 * Adds the phase under the plan's row lock, so two phases added at once get two numbers.
 */
final readonly class AddPhaseHandler implements CommandHandler
{
    public function handle(AddPhase $command): string
    {
        $plan = Plan::query()->findOr($command->planId, fn () => throw PlanMissing::withId($command->planId));

        return $plan->addPhase($command->title)->id;
    }
}
