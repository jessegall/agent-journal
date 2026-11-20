<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

enum AskAbility: string implements ClassLevelAbilities
{
    case Work = 'work';

    public function isClassLevel(): bool
    {
        return true;
    }
}
