<?php

declare(strict_types=1);

namespace App\Communication\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with messages: ordinary work, which every granted actor has, and inspecting the messages of
 * inboxes it does not belong to and recovering stalled claims, which only the owner has.
 */
enum MessageAbility: string implements ClassLevelAbilities
{
    case Work = 'work';
    case Inspect = 'inspect';
    case Recover = 'recover';

    public function isClassLevel(): bool
    {
        return true;
    }
}
