<?php

declare(strict_types=1);

namespace Domain\Plans\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with plans.
 */
enum PlanAbility: string implements ClassLevelAbilities
{
    case Work = 'work';

    /**
     * Ordinary work is decided on the model class alone.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
