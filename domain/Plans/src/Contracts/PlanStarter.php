<?php

declare(strict_types=1);

namespace Domain\Plans\Contracts;

use Domain\Plans\Actions\StartPlan;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Illuminate\Container\Attributes\Bind;

/**
 * Starts a plan by its id for whoever acts in this request: once, under the plan's row lock. Starting a plan that
 * already runs changes nothing.
 */
#[Bind(StartPlan::class)]
interface PlanStarter
{
    /**
     * @throws PlanMissing when no plan has this id
     * @throws StartDenied when the plan may not start in its state
     */
    public function start(int $planId): void;
}
