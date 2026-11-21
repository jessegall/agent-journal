<?php

declare(strict_types=1);

namespace Domain\Plans\States\Support;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\SubjectReference;

/**
 * The stack reference of working on a plan.
 */
final class WorkingOnPlanStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'plans.working';

    public static function forPlan(string $planId): StateReference
    {
        return self::about(new SubjectReference($planId, 1));
    }
}
