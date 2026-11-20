<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

enum SupervisorAbility: string implements DeclaresClassLevelAbilities
{
    case ChangeRoute = 'change-route';

    public function isClassLevel(): bool
    {
        return true;
    }
}
