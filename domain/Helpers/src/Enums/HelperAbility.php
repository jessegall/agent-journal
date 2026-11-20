<?php

declare(strict_types=1);

namespace Domain\Helpers\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with its helpers.
 */
enum HelperAbility: string implements DeclaresClassLevelAbilities
{
    case Dispatch = 'dispatch';

    /**
     * Decided on the job class alone; whether the caller may delegate is the dispatch's own check.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
