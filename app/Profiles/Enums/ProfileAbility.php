<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with agent profiles and the main start.
 */
enum ProfileAbility: string implements ClassLevelAbilities
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
