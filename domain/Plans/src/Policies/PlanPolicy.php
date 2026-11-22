<?php

declare(strict_types=1);

namespace Domain\Plans\Policies;

use App\Contracts\Authorization\Policy;
use Domain\Plans\Models\Plan;

/**
 * Who may work with plans: every granted actor, so the grants decide.
 */
final readonly class PlanPolicy implements Policy
{
    public static function model(): string
    {
        return Plan::class;
    }
}
