<?php

declare(strict_types=1);

namespace App\Desks\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with desks: arranging them is creating desks and changing who sits where.
 */
enum DeskAbility: string implements ClassLevelAbilities
{
    case Arrange = 'arrange';

    public function isClassLevel(): bool
    {
        return true;
    }
}
