<?php

declare(strict_types=1);

namespace Domain\Rules\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with a project rule.
 */
enum RuleAbility: string implements DeclaresClassLevelAbilities
{
    case Propose = 'propose';
    case Approve = 'approve';
    case Deny = 'deny';
    case Remove = 'remove';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
