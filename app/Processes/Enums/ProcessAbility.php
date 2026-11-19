<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with command rules, their requests, approvals and process output.
 */
enum ProcessAbility: string implements DeclaresClassLevelAbilities
{
    case Administer = 'administer';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
