<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with the ledgers.
 */
enum LedgerAbility: string implements DeclaresClassLevelAbilities
{
    case Work = 'work';

    /**
     * The work is decided on the model class alone.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
