<?php

declare(strict_types=1);

namespace App\Desks\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with desks: arranging them is creating desks and changing who sits where.
 */
enum DeskAbility: string implements DeclaresClassLevelAbilities
{
    case Arrange = 'arrange';

    public function isClassLevel(): bool
    {
        return true;
    }
}
