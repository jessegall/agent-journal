<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with its own message pins.
 */
enum MessagePinAbility: string implements DeclaresClassLevelAbilities
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
