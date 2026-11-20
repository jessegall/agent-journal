<?php

declare(strict_types=1);

namespace App\Sharing\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with shares: ask for one, or run the sharing itself.
 */
enum SharingAbility: string implements ClassLevelAbilities
{
    case Request = 'request';
    case Administer = 'administer';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
