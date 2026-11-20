<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with the ledgers.
 */
enum LedgerAbility: string implements ClassLevelAbilities
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
