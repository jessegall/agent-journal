<?php

declare(strict_types=1);

namespace Domain\Plans\States\Support;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\SubjectReference;
use Domain\Plans\Models\Plan;

/**
 * The stack reference of working on a plan.
 */
final class WorkingOnPlanStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'plans.working';

    public static function forPlan(Plan $plan): StateReference
    {
        return self::about(new SubjectReference($plan->id, 1));
    }
}
