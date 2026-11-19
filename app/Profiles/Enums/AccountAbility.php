<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with the saved Claude Code and Codex accounts: read them, or change them and sign them in.
 */
enum AccountAbility: string implements DeclaresClassLevelAbilities
{
    case Read = 'read';
    case Manage = 'manage';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
