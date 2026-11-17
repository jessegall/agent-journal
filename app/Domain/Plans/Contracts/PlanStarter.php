<?php

declare(strict_types=1);

namespace App\Domain\Plans\Contracts;

use App\Domain\Plans\Actions\StartPlan;
use App\Domain\Plans\Exceptions\PlanMissing;
use App\Domain\Plans\Exceptions\StartDenied;
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
