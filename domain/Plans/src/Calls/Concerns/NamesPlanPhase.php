<?php

declare(strict_types=1);

namespace Domain\Plans\Calls\Concerns;

use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A call about one phase of a plan, named by the plan's number and the phase's number in it.
 */
trait NamesPlanPhase
{
    /**
     * @throws NotFoundHttpException
     */
    public function phaseOfPlan(): Phase
    {
        $plan = Plan::query()->findOr(Plan::idOfNumber($this->plan), fn () => throw new NotFoundHttpException());

        try {
            return $plan->phaseNumbered($this->phase);
        } catch (PhaseMissing $missingPhase) {
            throw new NotFoundHttpException(previous: $missingPhase);
        }
    }
}
