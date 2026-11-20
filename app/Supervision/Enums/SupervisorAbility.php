<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

enum SupervisorAbility: string implements ClassLevelAbilities
{
    case ChangeRoute = 'change-route';

    public function isClassLevel(): bool
    {
        return true;
    }
}
