<?php

declare(strict_types=1);

namespace App\Records\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with links between records.
 */
enum RecordLinkAbility: string implements DeclaresClassLevelAbilities
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
