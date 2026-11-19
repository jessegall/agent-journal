<?php

declare(strict_types=1);

namespace Domain\Memory\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with memories.
 */
enum MemoryAbility: string implements DeclaresClassLevelAbilities
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
