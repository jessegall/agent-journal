<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

enum AskAbility: string implements DeclaresClassLevelAbilities
{
    case Work = 'work';

    public function isClassLevel(): bool
    {
        return true;
    }
}
