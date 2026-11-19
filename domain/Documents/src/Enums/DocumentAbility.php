<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What only the owner does with documents and reports: recover a draft, and change a record another actor created.
 */
enum DocumentAbility: string implements DeclaresClassLevelAbilities
{
    case Administer = 'administer';
    case ChangeOthersRecords = 'change-others-records';
    case Work = 'work';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
