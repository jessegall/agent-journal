<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States\Support;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * The stack reference of reviewing a plan.
 */
final class ReviewingPlanStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'plans.reviewing';

    public static function forPlan(string $planId): StateReference
    {
        return self::about(new SubjectReference($planId, 1));
    }
}
