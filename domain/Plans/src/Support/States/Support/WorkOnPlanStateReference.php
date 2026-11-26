<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States\Support;

use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;

/**
 * The stack reference of working on a plan.
 */
final class WorkOnPlanStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'plans.work';
    }

    public static function forPlan(string $planId): StateReference
    {
        return self::about(new SubjectReference($planId, 1), ['planId' => $planId]);
    }
}
